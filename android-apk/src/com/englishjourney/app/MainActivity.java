package com.englishjourney.app;

import android.Manifest;
import android.app.Activity;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Build;
import android.os.Bundle;
import android.speech.RecognitionListener;
import android.speech.RecognizerIntent;
import android.speech.SpeechRecognizer;
import android.speech.tts.TextToSpeech;
import android.speech.tts.UtteranceProgressListener;
import android.view.KeyEvent;
import android.view.Window;
import android.view.WindowManager;
import android.webkit.JavascriptInterface;
import android.webkit.PermissionRequest;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import java.util.ArrayList;
import java.util.Locale;

public class MainActivity extends Activity implements TextToSpeech.OnInitListener {
    private static final int REQUEST_RECORD_AUDIO = 2001;
    private static final int SPEECH_REQUEST_CODE = 2002;

    private WebView mWebView;
    private TextToSpeech mTTS;
    private boolean mTTSReady = false;
    private SpeechRecognizer mSpeechRecognizer;
    private boolean mIsListening = false;
    private String mPendingSTTLang = "en-US";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Initialize Android Native TextToSpeech Engine
        mTTS = new TextToSpeech(this, this);

        // Customize Status Bar Color
        Window window = getWindow();
        window.addFlags(WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS);
        window.setStatusBarColor(0xFF0B1B3D);

        mWebView = new WebView(this);
        setContentView(mWebView);

        WebSettings settings = mWebView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(true);
        settings.setMediaPlaybackRequiresUserGesture(false);
        settings.setBuiltInZoomControls(false);
        settings.setDisplayZoomControls(false);

        mWebView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                view.loadUrl(url);
                return true;
            }
        });

        mWebView.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onPermissionRequest(final PermissionRequest request) {
                request.grant(request.getResources());
            }
        });

        // Expose Native Android TTS & STT Bridges to WebView JavaScript
        mWebView.addJavascriptInterface(new AndroidNativeTTSInterface(), "AndroidNativeTTS");
        mWebView.addJavascriptInterface(new AndroidNativeSTTInterface(), "AndroidNativeSTT");

        mWebView.loadUrl("file:///android_asset/www/index.html");
    }

    @Override
    public void onInit(int status) {
        if (status == TextToSpeech.SUCCESS) {
            mTTSReady = true;
            if (mTTS != null) {
                mTTS.setSpeechRate(0.9f);
                mTTS.setOnUtteranceProgressListener(new UtteranceProgressListener() {
                    @Override
                    public void onStart(String utteranceId) {}

                    @Override
                    public void onDone(final String utteranceId) {
                        runOnUiThread(new Runnable() {
                            @Override
                            public void run() {
                                mWebView.evaluateJavascript("if (window.onNativeTTSDone) window.onNativeTTSDone('" + utteranceId + "');", null);
                            }
                        });
                    }

                    @Override
                    public void onError(final String utteranceId) {
                        runOnUiThread(new Runnable() {
                            @Override
                            public void run() {
                                mWebView.evaluateJavascript("if (window.onNativeTTSError) window.onNativeTTSError('" + utteranceId + "');", null);
                            }
                        });
                    }
                });
            }
        }
    }

    public class AndroidNativeTTSInterface {
        @JavascriptInterface
        public boolean isAvailable() {
            return mTTSReady;
        }

        @JavascriptInterface
        public void speak(String text, String langCode, float rate, String utteranceId) {
            if (!mTTSReady || mTTS == null || text == null || text.trim().isEmpty()) {
                return;
            }
            Locale targetLocale;
            if ("ar".equalsIgnoreCase(langCode) || "ar-SA".equalsIgnoreCase(langCode)) {
                targetLocale = new Locale("ar", "SA");
            } else {
                targetLocale = Locale.US;
            }

            int res = mTTS.setLanguage(targetLocale);
            if (res == TextToSpeech.LANG_MISSING_DATA || res == TextToSpeech.LANG_NOT_SUPPORTED) {
                if ("ar".equalsIgnoreCase(langCode)) {
                    mTTS.setLanguage(new Locale("ar"));
                } else {
                    mTTS.setLanguage(Locale.ENGLISH);
                }
            }

            mTTS.setSpeechRate(rate > 0 ? rate : 0.9f);

            Bundle params = new Bundle();
            params.putString(TextToSpeech.Engine.KEY_PARAM_UTTERANCE_ID, utteranceId);
            mTTS.speak(text, TextToSpeech.QUEUE_FLUSH, params, utteranceId);
        }

        @JavascriptInterface
        public void stop() {
            if (mTTSReady && mTTS != null) {
                mTTS.stop();
            }
        }
    }

    public class AndroidNativeSTTInterface {
        @JavascriptInterface
        public boolean isAvailable() {
            return SpeechRecognizer.isRecognitionAvailable(MainActivity.this);
        }

        @JavascriptInterface
        public void startListening(final String langCode) {
            mPendingSTTLang = (langCode != null && !langCode.isEmpty()) ? langCode : "en-US";
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                        if (checkSelfPermission(Manifest.permission.RECORD_AUDIO) != PackageManager.PERMISSION_GRANTED) {
                            requestPermissions(new String[]{Manifest.permission.RECORD_AUDIO}, REQUEST_RECORD_AUDIO);
                            return;
                        }
                    }
                    startSpeechRecognitionInternal(mPendingSTTLang);
                }
            });
        }

        @JavascriptInterface
        public void stopListening() {
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    if (mSpeechRecognizer != null) {
                        try {
                            mSpeechRecognizer.stopListening();
                        } catch (Exception e) {}
                    }
                    mIsListening = false;
                }
            });
        }
    }

    private void startSpeechRecognitionInternal(final String langCode) {
        if (!SpeechRecognizer.isRecognitionAvailable(this)) {
            // Intent fallback if SpeechRecognizer service is missing
            try {
                Intent intent = new Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH);
                intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM);
                intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE, (langCode != null && !langCode.isEmpty()) ? langCode : "en-US");
                intent.putExtra(RecognizerIntent.EXTRA_PROMPT, "تحدث بالإنجليزية الآن...");
                startActivityForResult(intent, SPEECH_REQUEST_CODE);
                return;
            } catch (Exception e) {
                mWebView.evaluateJavascript("if (window.onNativeSTTError) window.onNativeSTTError('not_available');", null);
                return;
            }
        }

        if (mSpeechRecognizer != null) {
            try {
                mSpeechRecognizer.destroy();
            } catch (Exception e) {}
        }

        try {
            mSpeechRecognizer = SpeechRecognizer.createSpeechRecognizer(this);
            mSpeechRecognizer.setRecognitionListener(new RecognitionListener() {
                @Override
                public void onReadyForSpeech(Bundle params) {
                    mIsListening = true;
                    runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            mWebView.evaluateJavascript("if (window.onNativeSTTListening) window.onNativeSTTListening();", null);
                        }
                    });
                }

                @Override
                public void onBeginningOfSpeech() {}

                @Override
                public void onRmsChanged(float rmsdB) {}

                @Override
                public void onBufferReceived(byte[] buffer) {}

                @Override
                public void onEndOfSpeech() {
                    mIsListening = false;
                }

                @Override
                public void onError(final int error) {
                    mIsListening = false;
                    runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            mWebView.evaluateJavascript("if (window.onNativeSTTError) window.onNativeSTTError('err_" + error + "');", null);
                        }
                    });
                }

                @Override
                public void onResults(final Bundle results) {
                    mIsListening = false;
                    runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            ArrayList<String> matches = results != null ? results.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION) : null;
                            String text = (matches != null && !matches.isEmpty()) ? matches.get(0) : "";
                            String safeText = text.replace("\\", "\\\\").replace("'", "\\'").replace("\n", " ");
                            mWebView.evaluateJavascript("if (window.onNativeSTTResult) window.onNativeSTTResult('" + safeText + "');", null);
                        }
                    });
                }

                @Override
                public void onPartialResults(Bundle partialResults) {}

                @Override
                public void onEvent(int eventType, Bundle params) {}
            });

            Intent intent = new Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH);
            intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM);
            intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE, (langCode != null && !langCode.isEmpty()) ? langCode : "en-US");
            intent.putExtra(RecognizerIntent.EXTRA_MAX_RESULTS, 3);
            mSpeechRecognizer.startListening(intent);
        } catch (Exception e) {
            mWebView.evaluateJavascript("if (window.onNativeSTTError) window.onNativeSTTError('" + e.getMessage() + "');", null);
        }
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode == REQUEST_RECORD_AUDIO) {
            if (grantResults != null && grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                startSpeechRecognitionInternal(mPendingSTTLang);
            } else {
                mWebView.evaluateJavascript("if (window.onNativeSTTError) window.onNativeSTTError('permission_denied');", null);
            }
        }
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == SPEECH_REQUEST_CODE) {
            if (resultCode == RESULT_OK && data != null) {
                ArrayList<String> matches = data.getStringArrayListExtra(RecognizerIntent.EXTRA_RESULTS);
                String text = (matches != null && !matches.isEmpty()) ? matches.get(0) : "";
                String safeText = text.replace("\\", "\\\\").replace("'", "\\'").replace("\n", " ");
                mWebView.evaluateJavascript("if (window.onNativeSTTResult) window.onNativeSTTResult('" + safeText + "');", null);
            } else {
                mWebView.evaluateJavascript("if (window.onNativeSTTError) window.onNativeSTTError('cancelled');", null);
            }
        }
    }

    @Override
    protected void onDestroy() {
        if (mSpeechRecognizer != null) {
            try {
                mSpeechRecognizer.destroy();
            } catch (Exception e) {}
            mSpeechRecognizer = null;
        }
        if (mTTS != null) {
            mTTS.stop();
            mTTS.shutdown();
        }
        super.onDestroy();
    }

    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        if (keyCode == KeyEvent.KEYCODE_BACK && mWebView.canGoBack()) {
            mWebView.goBack();
            return true;
        }
        return super.onKeyDown(keyCode, event);
    }
}
