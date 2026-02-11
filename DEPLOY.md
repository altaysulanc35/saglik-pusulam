# Google Cloud Run Dağıtım Rehberi

Projeniz artık Google Cloud Run üzerinde çalışmaya hazır! Aşağıdaki adımları takiperek yayınlayabilirsiniz.

## Ön Hazırlık

1.  **Google Cloud CLI (gcloud)** yüklü olduğundan emin olun.
2.  Google Cloud projenizi seçin:
    ```bash
    gcloud config set project [PROJE_ID]
    ```

## 1. Yöntem: Cloud Build ile Otomatik Dağıtım (Önerilen)

Bu yöntem, `cloudbuild.yaml` dosyasını kullanarak Docker imajını oluşturur ve Cloud Run'a dağıtır.

1.  Cloud Build ve Cloud Run API'lerini etkinleştirin:
    ```bash
    gcloud services enable cloudbuild.googleapis.com run.googleapis.com
    ```

2.  Dağıtımı başlatın:
    ```bash
    gcloud builds submit --config cloudbuild.yaml .
    ```

3.  İşlem bittiğinde, terminalde size uygulamanızın URL adresi verilecektir.

## 2. Yöntem: Manuel Docker Build ve Deploy

Eğer Cloud Build kullanmak istemezseniz, manuel olarak da yapabilirsiniz.

1.  Docker imajını oluşturun:
    ```bash
    docker build -t gcr.io/[PROJE_ID]/saglik-pusulam .
    ```

2.  İmajı Google Container Registry'ye yükleyin:
    ```bash
    docker push gcr.io/[PROJE_ID]/saglik-pusulam
    ```

3.  Cloud Run'a dağıtın:
    ```bash
    gcloud run deploy saglik-pusulam --image gcr.io/[PROJE_ID]/saglik-pusulam --platform managed --region europe-west1 --allow-unauthenticated
    ```

## Notlar

*   **Veritabanı**: Uygulama şu an veritabanı bağlantısı olmadan çalışacak şekilde ayarlandı (`server/db.ts` içinde opsiyonel yapıldı). Eğer veritabanı bağlamak isterseniz, Google Cloud SQL kullanabilir ve `DATABASE_URL` ortam değişkenini ayarlayabilirsiniz.
*   **Yapay Zeka (OpenAI) [KRİTİK]**: Uygulamanın çalışması için Cloud Run'da `OPENAI_API_KEY` ortam değişkeni **MUTLAKA** tanımlanmalıdır.
    1. Cloud Run konsolunda servisinize gidin.
    2. "Edit & Deploy New Revision" butonuna tıklayın.
    3. "Variables & Secrets" sekmesine gelin.
    4. "Add Variable" diyerek Name: `OPENAI_API_KEY`, Value: `(Senin OpenAI API Anahtarın)` girin.
    5. Mevcut `GEMINI_API_KEY` varsa silebilirsiniz.
    6. Deploy edin.
*   **Hatalar**: Derleme (build) işlemi `npm run check` ve `npm run build` ile doğrulanmıştır.
