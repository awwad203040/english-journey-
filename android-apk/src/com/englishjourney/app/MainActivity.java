package com.englishjourney.app;

import android.app.Activity;
import android.os.Bundle;
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
import java.util.Locale;

public class MainActivity extends Activity implements TextToSpeech.OnInitListener {
    private WebView mWebView;
    private TextToSpeech mTTS;
    private boolean mTTSReady = false;

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

        // Expose Native Android TTS Bridge to WebView JavaScript
        mWebView.addJavascriptInterface(new AndroidNativeTTSInterface(), "AndroidNativeTTS");

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
                // Fallback to generic Arabic or English
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

    @Override
    protected void onDestroy() {
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
