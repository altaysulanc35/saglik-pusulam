# Google Cloud Run Dağıtım Rehberi

Bu proje, Google Cloud Run üzerinde çalışacak şekilde yapılandırılmıştır. Aşağıdaki adımları takip ederek uygulamanızı yayınlayabilirsiniz.

## Ön Hazırlık

1.  **Google Cloud SDK**'yı yükleyin ve giriş yapın:
    ```bash
    gcloud auth login
    gcloud config set project [PROJE_ID]
    ```

2.  **API'leri Etkinleştirin**:
    Cloud Run ve Container Registry API'lerinin etkin olduğundan emin olun.
    ```bash
    gcloud services enable run.googleapis.com containerregistry.googleapis.com cloudbuild.googleapis.com
    ```

## 1. Yöntem: Doğrudan Kaynak Koddan Dağıtım (Önerilen)

En kolay yöntem, kaynak kodunuzu doğrudan Cloud Run'a göndermektir. Google Cloud Build, Dockerfile'ı kullanarak imajı sizin için oluşturur.

```bash
gcloud run deploy saglik-pusulam --source . --region europe-west1 --allow-unauthenticated
```

-   `saglik-pusulam`: Servis adı.
-   `--source .`: Bulunduğunuz klasörü kaynak olarak kullanır.
-   `--region europe-west1`: Sunucu bölgesi (Türkiye'ye yakın olduğu için Belçika seçildi, değiştirebilirsiniz).
-   `--allow-unauthenticated`: Uygulamanın herkese açık olmasını sağlar.

Komutu çalıştırdıktan sonra size veritabanı bağlantısı gibi ortam değişkenlerini (environment variables) sormazsa, deployment sonrası panelden eklemeniz gerekebilir.

## 2. Yöntem: Ortam Değişkenlerini Ayarlama

Uygulamanızın veritabanına bağlanabilmesi için `DATABASE_URL` gibi değişkenlere ihtiyacı vardır.

### Terminal ile Ayarlama:

```bash
gcloud run services update saglik-pusulam \
  --set-env-vars DATABASE_URL="postgresql://kullanici:sifre@host:port/veritabani" \
  --region europe-west1
```

### Google Cloud Console ile Ayarlama (Arayüzden):

1.  Google Cloud Console'da **Cloud Run** sayfasına gidin.
2.  `saglik-pusulam` servisine tıklayın.
3.  Üstteki **Edit & Deploy New Revision** butonuna tıklayın.
4.  **Variables & Secrets** sekmesine gelin.
5.  `DATABASE_URL` ve diğer gerekli değişkenleri (varsa `SESSION_SECRET` vb.) ekleyin.
6.  **Deploy** butonuna basın.

## Sorun Giderme

Eğer "Internal Server Error" alırsanız veya uygulama açılmazsa:

1.  Cloud Run panelinde **Logs** sekmesine gidin.
2.  Burada uygulamanın neden çöktüğünü (genellikle veritabanı bağlantı hatası) görebilirsiniz.
3.  Port hatası alıyorsanız endişelenmeyin, Dockerfile `PORT` değişkenini otomatik algılayacak şekilde ayarlandı.
