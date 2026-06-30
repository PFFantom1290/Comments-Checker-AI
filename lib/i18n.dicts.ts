import type { Dict, DeepPartial, Locale } from "@/lib/i18n";

// Each language is a PARTIAL dictionary — omit any key and it falls back to
// English (see getDictionary in lib/i18n.ts). Major languages are fully
// translated; a few smaller ones are partial and worth a native-speaker review.

const ru: DeepPartial<Dict> = {
  nav: { signOut: "Выйти", buyScans: "Купить сканирования" },
  home: {
    badge: "Анализ отзывов на базе ИИ",
    subtitle: "Вставьте ссылку на любой товар. Мы читаем настоящие отзывы покупателей за вас — и даём простой вердикт: покупать или нет.",
  },
  analyzer: {
    analyze: "Анализировать", analyzing: "Анализируем…", unlimited: "Безлимитные сканирования · админ",
    scansLeft: "Осталось сканирований: {n}", noScans: "Сканирования закончились", buyMore: "Купить ещё",
    loading: "Загрузка страницы → извлечение отзывов → анализ ИИ…", errorTitle: "Не удалось проанализировать",
    tryAnother: "Попробовать другую ссылку", outTitle: "Сканирования закончились",
    outBody: "Купите пакет сканирований, чтобы продолжить — от $1.99, без срока действия.", buyScans: "Купить сканирования",
    supported: "Работает с Amazon, eBay, Walmart, Best Buy, Rozetka, Comfy и большинством страниц товаров с публичными отзывами.",
  },
  result: {
    product: "Товар", confidence: "Уверенность: {n}%", estRating: "Прибл. оценка", reviewsRead: "Прочитано отзывов",
    fakeRisk: "Риск фейковых отзывов", riskLow: "Низкий", riskMedium: "Средний", riskHigh: "Высокий",
    sentiment: "Настроение отзывов", positive: "положительные", neutral: "нейтральные", negative: "отрицательные",
    bottomLine: "Итог", love: "Что нравится людям", complaints: "Частые жалобы", none: "Не выявлено",
    details: "По деталям", bestFor: "Подходит для", watchOut: "Обратите внимание", summary: "Обзор",
    authenticity: "Достоверность", analyzeAnother: "Проанализировать другой", buy: "ПОКУПАТЬ", dontBuy: "НЕ ПОКУПАТЬ", mixed: "НЕОДНОЗНАЧНО",
  },
  auth: {
    welcomeBack: "С возвращением", signInSub: "Войдите, чтобы анализировать отзывы.", createTitle: "Создайте аккаунт",
    createSub: "Получите 3 бесплатных анализа.", name: "Имя (необязательно)", email: "Эл. почта", password: "Пароль",
    confirm: "Подтвердите пароль", signIn: "Войти", create: "Создать аккаунт", pleaseWait: "Подождите…", or: "или",
    google: "Продолжить с Google", noAccount: "Нет аккаунта?", signUp: "Зарегистрироваться", haveAccount: "Уже есть аккаунт?",
    invalid: "Неверная почта или пароль.", mismatch: "Пароли не совпадают.", short: "Пароль должен содержать не менее 8 символов.",
  },
  billing: {
    back: "← Назад к анализатору", title: "Купить больше сканирований",
    youHave: "Сейчас вам доступно сканирований: {n}. Пополняйте в любое время — купленные сканирования не сгорают.",
    adminUnlimited: "Вы администратор — у вас уже безлимитные сканирования.", canceled: "Оплата отменена — деньги не списаны.",
    scans: "сканирований", perScan: "{c}¢ / сканирование", buy: "Купить", opening: "Открываем оплату…",
    secured: "Платежи безопасно обрабатывает Paddle, наш реселлер. Данные карт не хранятся на наших серверах.",
  },
  success: {
    successTitle: "Оплата прошла успешно", added: "На ваш аккаунт добавлено сканирований: {n}.",
    youNow: "Теперь вам доступно сканирований: {n}.", almost: "Почти готово", start: "Начать анализ", buyMore: "Купить ещё",
  },
};

const uk: DeepPartial<Dict> = {
  nav: { signOut: "Вийти", buyScans: "Купити сканування" },
  home: {
    badge: "Аналіз відгуків на основі ШІ",
    subtitle: "Вставте посилання на будь-який товар. Ми читаємо реальні відгуки покупців за вас — і даємо просту відповідь: купувати чи ні.",
  },
  analyzer: {
    analyze: "Аналізувати", analyzing: "Аналізуємо…", unlimited: "Безлімітні сканування · адмін",
    scansLeft: "Залишилось сканувань: {n}", noScans: "Сканування закінчились", buyMore: "Купити ще",
    loading: "Завантаження сторінки → витяг відгуків → аналіз ШІ…", errorTitle: "Не вдалося проаналізувати",
    tryAnother: "Спробувати інше посилання", outTitle: "У вас закінчились сканування",
    outBody: "Придбайте пакет сканувань, щоб продовжити — від $1.99, без терміну дії.", buyScans: "Купити сканування",
    supported: "Працює з Amazon, eBay, Walmart, Best Buy, Rozetka, Comfy та більшістю сторінок товарів з публічними відгуками.",
  },
  result: {
    product: "Товар", confidence: "Впевненість: {n}%", estRating: "Орієнт. оцінка", reviewsRead: "Прочитано відгуків",
    fakeRisk: "Ризик фейкових відгуків", riskLow: "Низький", riskMedium: "Середній", riskHigh: "Високий",
    sentiment: "Настрій відгуків", positive: "позитивні", neutral: "нейтральні", negative: "негативні",
    bottomLine: "Підсумок", love: "Що подобається людям", complaints: "Часті скарги", none: "Не виявлено",
    details: "За деталями", bestFor: "Підходить для", watchOut: "Зверніть увагу", summary: "Огляд",
    authenticity: "Достовірність", analyzeAnother: "Проаналізувати інший", buy: "КУПУВАТИ", dontBuy: "НЕ КУПУВАТИ", mixed: "НЕОДНОЗНАЧНО",
  },
  auth: {
    welcomeBack: "З поверненням", signInSub: "Увійдіть, щоб аналізувати відгуки про товари.", createTitle: "Створіть обліковий запис",
    createSub: "Отримайте 3 безкоштовні аналізи відгуків.", name: "Ім'я (необов'язково)", email: "Електронна пошта", password: "Пароль",
    confirm: "Підтвердьте пароль", signIn: "Увійти", create: "Створити акаунт", pleaseWait: "Зачекайте…", or: "або",
    google: "Продовжити з Google", noAccount: "Немає облікового запису?", signUp: "Зареєструватися", haveAccount: "Вже маєте акаунт?",
    invalid: "Невірна пошта або пароль.", mismatch: "Паролі не збігаються.", short: "Пароль має містити щонайменше 8 символів.",
  },
  billing: {
    back: "← Назад до аналізатора", title: "Купити більше сканувань",
    youHave: "Зараз у вас доступно сканувань: {n}. Поповнюйте будь-коли — куплені сканування не згоряють.",
    adminUnlimited: "Ви адміністратор — у вас уже безлімітні сканування.", canceled: "Оплату скасовано — кошти не списано.",
    scans: "сканувань", perScan: "{c}¢ / сканування", buy: "Купити", opening: "Відкриваємо оплату…",
    secured: "Платежі безпечно обробляє Paddle, наш продавець-реселер. Дані карток не зберігаються на наших серверах.",
  },
  success: {
    successTitle: "Оплата успішна", added: "До вашого акаунту додано сканувань: {n}.",
    youNow: "Тепер у вас доступно сканувань: {n}.", almost: "Майже готово", start: "Почати аналіз", buyMore: "Купити ще",
  },
};

const de: DeepPartial<Dict> = {
  nav: { signOut: "Abmelden", buyScans: "Scans kaufen" },
  home: {
    badge: "KI-gestützte Bewertungsanalyse",
    subtitle: "Füge eine Produkt-URL ein. Wir lesen die echten Kundenbewertungen für dich — und geben ein klares Urteil: Kaufen / Nicht kaufen.",
  },
  analyzer: {
    analyze: "Analysieren", analyzing: "Analysiere…", unlimited: "Unbegrenzte Scans · Admin",
    scansLeft: "Noch {n} Scans übrig", noScans: "Keine Scans übrig", buyMore: "Mehr kaufen",
    loading: "Seite laden → Bewertungen extrahieren → KI-Analyse…", errorTitle: "Analyse fehlgeschlagen",
    tryAnother: "Andere URL versuchen", outTitle: "Deine Scans sind aufgebraucht",
    outBody: "Hol dir ein Scan-Paket, um weiterzumachen — ab $1.99, ohne Ablaufdatum.", buyScans: "Scans kaufen",
    supported: "Funktioniert mit Amazon, eBay, Walmart, Best Buy, Rozetka, Comfy und den meisten Produktseiten mit öffentlichen Bewertungen.",
  },
  result: {
    product: "Produkt", confidence: "{n}% Sicherheit", estRating: "Gesch. Bewertung", reviewsRead: "Gelesene Bewertungen",
    fakeRisk: "Risiko gefälschter Bewertungen", riskLow: "Niedrig", riskMedium: "Mittel", riskHigh: "Hoch",
    sentiment: "Stimmung der Bewertungen", positive: "positiv", neutral: "neutral", negative: "negativ",
    bottomLine: "Fazit", love: "Was Leute lieben", complaints: "Häufige Beschwerden", none: "Nichts gefunden",
    details: "Im Detail", bestFor: "Am besten für", watchOut: "Achte auf", summary: "Zusammenfassung",
    authenticity: "Echtheit", analyzeAnother: "Weiteres analysieren", buy: "KAUFEN", dontBuy: "NICHT KAUFEN", mixed: "GEMISCHT",
  },
  auth: {
    welcomeBack: "Willkommen zurück", signInSub: "Melde dich an, um Bewertungen zu analysieren.", createTitle: "Konto erstellen",
    createSub: "Erhalte 3 kostenlose Analysen.", name: "Name (optional)", email: "E-Mail", password: "Passwort",
    confirm: "Passwort bestätigen", signIn: "Anmelden", create: "Konto erstellen", pleaseWait: "Bitte warten…", or: "oder",
    google: "Mit Google fortfahren", noAccount: "Noch kein Konto?", signUp: "Registrieren", haveAccount: "Schon ein Konto?",
    invalid: "Ungültige E-Mail oder Passwort.", mismatch: "Passwörter stimmen nicht überein.", short: "Das Passwort muss mindestens 8 Zeichen haben.",
  },
  billing: {
    back: "← Zurück zum Analyzer", title: "Mehr Scans kaufen",
    youHave: "Du hast aktuell {n} Scans verfügbar. Jederzeit aufladen — gekaufte Scans verfallen nie.",
    adminUnlimited: "Du bist Admin — du hast bereits unbegrenzte Scans.", canceled: "Bezahlung abgebrochen — dir wurde nichts berechnet.",
    scans: "Scans", perScan: "{c}¢ / Scan", buy: "Kaufen", opening: "Öffne Bezahlung…",
    secured: "Zahlungen werden sicher von Paddle abgewickelt, unserem Reseller. Karten werden nie auf unseren Servern gespeichert.",
  },
  success: {
    successTitle: "Zahlung erfolgreich", added: "{n} Scans wurden deinem Konto gutgeschrieben.",
    youNow: "Du hast jetzt {n} Scans verfügbar.", almost: "Fast geschafft", start: "Analyse starten", buyMore: "Mehr kaufen",
  },
};

const fr: DeepPartial<Dict> = {
  nav: { signOut: "Se déconnecter", buyScans: "Acheter des analyses" },
  home: {
    badge: "Analyse d'avis par IA",
    subtitle: "Collez l'URL d'un produit. Nous lisons les vrais avis clients à votre place — et donnons un verdict clair : Acheter / Ne pas acheter.",
  },
  analyzer: {
    analyze: "Analyser", analyzing: "Analyse…", unlimited: "Analyses illimitées · admin",
    scansLeft: "{n} analyses restantes", noScans: "Plus d'analyses", buyMore: "En acheter",
    loading: "Chargement de la page → extraction des avis → analyse IA…", errorTitle: "Échec de l'analyse",
    tryAnother: "Essayer une autre URL", outTitle: "Vous n'avez plus d'analyses",
    outBody: "Prenez un pack pour continuer — à partir de $1.99 et sans expiration.", buyScans: "Acheter des analyses",
    supported: "Fonctionne avec Amazon, eBay, Walmart, Best Buy, Rozetka, Comfy et la plupart des pages produits avec avis publics.",
  },
  result: {
    product: "Produit", confidence: "{n}% de confiance", estRating: "Note estimée", reviewsRead: "Avis lus",
    fakeRisk: "Risque de faux avis", riskLow: "Faible", riskMedium: "Moyen", riskHigh: "Élevé",
    sentiment: "Tonalité des avis", positive: "positifs", neutral: "neutres", negative: "négatifs",
    bottomLine: "En résumé", love: "Ce qu'on adore", complaints: "Plaintes fréquentes", none: "Rien identifié",
    details: "En détail", bestFor: "Idéal pour", watchOut: "Attention à", summary: "Résumé",
    authenticity: "Authenticité", analyzeAnother: "Analyser un autre", buy: "ACHETER", dontBuy: "NE PAS ACHETER", mixed: "MITIGÉ",
  },
  auth: {
    welcomeBack: "Bon retour", signInSub: "Connectez-vous pour analyser les avis.", createTitle: "Créez votre compte",
    createSub: "Obtenez 3 analyses gratuites.", name: "Nom (facultatif)", email: "E-mail", password: "Mot de passe",
    confirm: "Confirmer le mot de passe", signIn: "Se connecter", create: "Créer un compte", pleaseWait: "Veuillez patienter…", or: "ou",
    google: "Continuer avec Google", noAccount: "Pas de compte ?", signUp: "S'inscrire", haveAccount: "Déjà un compte ?",
    invalid: "E-mail ou mot de passe invalide.", mismatch: "Les mots de passe ne correspondent pas.", short: "Le mot de passe doit comporter au moins 8 caractères.",
  },
  billing: {
    back: "← Retour à l'analyseur", title: "Acheter plus d'analyses",
    youHave: "Vous avez actuellement {n} analyses disponibles. Rechargez quand vous voulez — elles n'expirent jamais.",
    adminUnlimited: "Vous êtes admin — vous avez déjà des analyses illimitées.", canceled: "Paiement annulé — vous n'avez pas été débité.",
    scans: "analyses", perScan: "{c}¢ / analyse", buy: "Acheter", opening: "Ouverture du paiement…",
    secured: "Les paiements sont traités en toute sécurité par Paddle, notre revendeur. Les cartes ne sont jamais stockées.",
  },
  success: {
    successTitle: "Paiement réussi", added: "{n} analyses ajoutées à votre compte.",
    youNow: "Vous avez maintenant {n} analyses disponibles.", almost: "Presque terminé", start: "Commencer l'analyse", buyMore: "En acheter",
  },
};

const es: DeepPartial<Dict> = {
  nav: { signOut: "Cerrar sesión", buyScans: "Comprar escaneos" },
  home: {
    badge: "Análisis de reseñas con IA",
    subtitle: "Pega la URL de cualquier producto. Leemos las reseñas reales por ti — y te damos un veredicto claro: Comprar / No comprar.",
  },
  analyzer: {
    analyze: "Analizar", analyzing: "Analizando…", unlimited: "Escaneos ilimitados · admin",
    scansLeft: "{n} escaneos restantes", noScans: "Sin escaneos", buyMore: "Comprar más",
    loading: "Cargando página → extrayendo reseñas → análisis con IA…", errorTitle: "Falló el análisis",
    tryAnother: "Probar otra URL", outTitle: "Te quedaste sin escaneos",
    outBody: "Consigue un paquete para seguir analizando — desde $1.99 y nunca caducan.", buyScans: "Comprar escaneos",
    supported: "Funciona con Amazon, eBay, Walmart, Best Buy, Rozetka, Comfy y la mayoría de páginas de productos con reseñas públicas.",
  },
  result: {
    product: "Producto", confidence: "{n}% de confianza", estRating: "Valoración est.", reviewsRead: "Reseñas leídas",
    fakeRisk: "Riesgo de reseñas falsas", riskLow: "Bajo", riskMedium: "Medio", riskHigh: "Alto",
    sentiment: "Sentimiento de reseñas", positive: "positivas", neutral: "neutrales", negative: "negativas",
    bottomLine: "Conclusión", love: "Lo que gusta", complaints: "Quejas comunes", none: "Nada identificado",
    details: "En detalle", bestFor: "Ideal para", watchOut: "Ten cuidado con", summary: "Resumen",
    authenticity: "Autenticidad", analyzeAnother: "Analizar otro", buy: "COMPRAR", dontBuy: "NO COMPRAR", mixed: "MIXTO",
  },
  auth: {
    welcomeBack: "Bienvenido de nuevo", signInSub: "Inicia sesión para analizar reseñas.", createTitle: "Crea tu cuenta",
    createSub: "Obtén 3 análisis de reseñas gratis.", name: "Nombre (opcional)", email: "Correo electrónico", password: "Contraseña",
    confirm: "Confirmar contraseña", signIn: "Iniciar sesión", create: "Crear cuenta", pleaseWait: "Espera…", or: "o",
    google: "Continuar con Google", noAccount: "¿No tienes cuenta?", signUp: "Regístrate", haveAccount: "¿Ya tienes cuenta?",
    invalid: "Correo o contraseña no válidos.", mismatch: "Las contraseñas no coinciden.", short: "La contraseña debe tener al menos 8 caracteres.",
  },
  billing: {
    back: "← Volver al analizador", title: "Comprar más escaneos",
    youHave: "Actualmente tienes {n} escaneos disponibles. Recarga cuando quieras — los escaneos comprados no caducan.",
    adminUnlimited: "Eres admin — ya tienes escaneos ilimitados.", canceled: "Pago cancelado — no se te ha cobrado.",
    scans: "escaneos", perScan: "{c}¢ / escaneo", buy: "Comprar", opening: "Abriendo el pago…",
    secured: "Los pagos los procesa Paddle de forma segura, nuestro comerciante registrado. No guardamos tarjetas.",
  },
  success: {
    successTitle: "Pago realizado", added: "Se añadieron {n} escaneos a tu cuenta.",
    youNow: "Ahora tienes {n} escaneos disponibles.", almost: "Casi listo", start: "Empezar a analizar", buyMore: "Comprar más",
  },
};

const it: DeepPartial<Dict> = {
  nav: { signOut: "Esci", buyScans: "Acquista scansioni" },
  home: {
    badge: "Analisi delle recensioni con IA",
    subtitle: "Incolla l'URL di un prodotto. Leggiamo le recensioni reali al posto tuo — e diamo un verdetto chiaro: Comprare / Non comprare.",
  },
  analyzer: {
    analyze: "Analizza", analyzing: "Analisi…", unlimited: "Scansioni illimitate · admin",
    scansLeft: "{n} scansioni rimaste", noScans: "Nessuna scansione", buyMore: "Acquista altre",
    loading: "Caricamento pagina → estrazione recensioni → analisi IA…", errorTitle: "Analisi fallita",
    tryAnother: "Prova un altro URL", outTitle: "Hai esaurito le scansioni",
    outBody: "Prendi un pacchetto per continuare — da $1.99 e senza scadenza.", buyScans: "Acquista scansioni",
    supported: "Funziona con Amazon, eBay, Walmart, Best Buy, Rozetka, Comfy e la maggior parte delle pagine prodotto con recensioni pubbliche.",
  },
  result: {
    product: "Prodotto", confidence: "{n}% di certezza", estRating: "Voto stimato", reviewsRead: "Recensioni lette",
    fakeRisk: "Rischio recensioni false", riskLow: "Basso", riskMedium: "Medio", riskHigh: "Alto",
    sentiment: "Tono delle recensioni", positive: "positive", neutral: "neutre", negative: "negative",
    bottomLine: "In sintesi", love: "Cosa piace", complaints: "Lamentele comuni", none: "Nulla identificato",
    details: "Nel dettaglio", bestFor: "Ideale per", watchOut: "Attenzione a", summary: "Riepilogo",
    authenticity: "Autenticità", analyzeAnother: "Analizza un altro", buy: "COMPRA", dontBuy: "NON COMPRARE", mixed: "MISTO",
  },
  auth: {
    welcomeBack: "Bentornato", signInSub: "Accedi per analizzare le recensioni.", createTitle: "Crea il tuo account",
    createSub: "Ottieni 3 analisi gratuite.", name: "Nome (facoltativo)", email: "Email", password: "Password",
    confirm: "Conferma password", signIn: "Accedi", create: "Crea account", pleaseWait: "Attendi…", or: "oppure",
    google: "Continua con Google", noAccount: "Non hai un account?", signUp: "Registrati", haveAccount: "Hai già un account?",
    invalid: "Email o password non validi.", mismatch: "Le password non coincidono.", short: "La password deve avere almeno 8 caratteri.",
  },
  billing: {
    back: "← Torna all'analizzatore", title: "Acquista altre scansioni",
    youHave: "Hai {n} scansioni disponibili. Ricarica quando vuoi — le scansioni acquistate non scadono.",
    adminUnlimited: "Sei admin — hai già scansioni illimitate.", canceled: "Pagamento annullato — non ti è stato addebitato nulla.",
    scans: "scansioni", perScan: "{c}¢ / scansione", buy: "Acquista", opening: "Apertura pagamento…",
    secured: "I pagamenti sono gestiti in sicurezza da Paddle, nostro rivenditore. Le carte non vengono mai memorizzate.",
  },
  success: {
    successTitle: "Pagamento riuscito", added: "{n} scansioni aggiunte al tuo account.",
    youNow: "Ora hai {n} scansioni disponibili.", almost: "Ci siamo quasi", start: "Inizia ad analizzare", buyMore: "Acquista altre",
  },
};

const pt: DeepPartial<Dict> = {
  nav: { signOut: "Sair", buyScans: "Comprar análises" },
  home: {
    badge: "Análise de avaliações com IA",
    subtitle: "Cole o link de qualquer produto. Lemos as avaliações reais por você — e damos um veredito simples: Comprar / Não comprar.",
  },
  analyzer: {
    analyze: "Analisar", analyzing: "Analisando…", unlimited: "Análises ilimitadas · admin",
    scansLeft: "{n} análises restantes", noScans: "Sem análises", buyMore: "Comprar mais",
    loading: "Carregando página → extraindo avaliações → análise por IA…", errorTitle: "Falha na análise",
    tryAnother: "Tentar outro link", outTitle: "Suas análises acabaram",
    outBody: "Pegue um pacote para continuar — a partir de $1.99 e sem validade.", buyScans: "Comprar análises",
    supported: "Funciona com Amazon, eBay, Walmart, Best Buy, Rozetka, Comfy e a maioria das páginas de produtos com avaliações públicas.",
  },
  result: {
    product: "Produto", confidence: "{n}% de confiança", estRating: "Nota estimada", reviewsRead: "Avaliações lidas",
    fakeRisk: "Risco de avaliações falsas", riskLow: "Baixo", riskMedium: "Médio", riskHigh: "Alto",
    sentiment: "Sentimento das avaliações", positive: "positivas", neutral: "neutras", negative: "negativas",
    bottomLine: "Conclusão", love: "O que as pessoas amam", complaints: "Reclamações comuns", none: "Nada identificado",
    details: "Nos detalhes", bestFor: "Ideal para", watchOut: "Fique atento a", summary: "Resumo",
    authenticity: "Autenticidade", analyzeAnother: "Analisar outro", buy: "COMPRAR", dontBuy: "NÃO COMPRAR", mixed: "MISTO",
  },
  auth: {
    welcomeBack: "Bem-vindo de volta", signInSub: "Entre para analisar avaliações.", createTitle: "Crie sua conta",
    createSub: "Ganhe 3 análises grátis.", name: "Nome (opcional)", email: "E-mail", password: "Senha",
    confirm: "Confirmar senha", signIn: "Entrar", create: "Criar conta", pleaseWait: "Aguarde…", or: "ou",
    google: "Continuar com Google", noAccount: "Não tem conta?", signUp: "Cadastre-se", haveAccount: "Já tem conta?",
    invalid: "E-mail ou senha inválidos.", mismatch: "As senhas não coincidem.", short: "A senha deve ter pelo menos 8 caracteres.",
  },
  billing: {
    back: "← Voltar ao analisador", title: "Comprar mais análises",
    youHave: "Você tem {n} análises disponíveis. Recarregue quando quiser — análises compradas não expiram.",
    adminUnlimited: "Você é admin — já tem análises ilimitadas.", canceled: "Pagamento cancelado — você não foi cobrado.",
    scans: "análises", perScan: "{c}¢ / análise", buy: "Comprar", opening: "Abrindo pagamento…",
    secured: "Os pagamentos são processados com segurança pela Paddle, nosso revendedor. Cartões nunca são armazenados.",
  },
  success: {
    successTitle: "Pagamento concluído", added: "{n} análises adicionadas à sua conta.",
    youNow: "Agora você tem {n} análises disponíveis.", almost: "Quase lá", start: "Começar a analisar", buyMore: "Comprar mais",
  },
};

const nl: DeepPartial<Dict> = {
  nav: { signOut: "Uitloggen", buyScans: "Scans kopen" },
  home: {
    badge: "AI-gestuurde recensieanalyse",
    subtitle: "Plak een product-URL. Wij lezen de echte klantbeoordelingen voor je — en geven een helder oordeel: Kopen / Niet kopen.",
  },
  analyzer: {
    analyze: "Analyseren", analyzing: "Analyseren…", unlimited: "Onbeperkte scans · admin",
    scansLeft: "Nog {n} scans over", noScans: "Geen scans meer", buyMore: "Meer kopen",
    loading: "Pagina laden → recensies extraheren → AI-analyse…", errorTitle: "Analyse mislukt",
    tryAnother: "Probeer een andere URL", outTitle: "Je scans zijn op",
    outBody: "Koop een scanpakket om door te gaan — vanaf $1.99 en nooit verlopen.", buyScans: "Scans kopen",
    supported: "Werkt met Amazon, eBay, Walmart, Best Buy, Rozetka, Comfy en de meeste productpagina's met openbare recensies.",
  },
  result: {
    product: "Product", confidence: "{n}% zekerheid", estRating: "Gesch. score", reviewsRead: "Gelezen recensies",
    fakeRisk: "Risico op neprecensies", riskLow: "Laag", riskMedium: "Gemiddeld", riskHigh: "Hoog",
    sentiment: "Sentiment van recensies", positive: "positief", neutral: "neutraal", negative: "negatief",
    bottomLine: "Conclusie", love: "Wat mensen waarderen", complaints: "Veelvoorkomende klachten", none: "Niets gevonden",
    details: "In detail", bestFor: "Het beste voor", watchOut: "Let op", summary: "Samenvatting",
    authenticity: "Echtheid", analyzeAnother: "Nog een analyseren", buy: "KOPEN", dontBuy: "NIET KOPEN", mixed: "GEMENGD",
  },
  auth: {
    welcomeBack: "Welkom terug", signInSub: "Log in om recensies te analyseren.", createTitle: "Maak je account",
    createSub: "Krijg 3 gratis analyses.", name: "Naam (optioneel)", email: "E-mail", password: "Wachtwoord",
    confirm: "Bevestig wachtwoord", signIn: "Inloggen", create: "Account aanmaken", pleaseWait: "Even geduld…", or: "of",
    google: "Doorgaan met Google", noAccount: "Nog geen account?", signUp: "Aanmelden", haveAccount: "Heb je al een account?",
    invalid: "Ongeldig e-mailadres of wachtwoord.", mismatch: "Wachtwoorden komen niet overeen.", short: "Het wachtwoord moet minstens 8 tekens hebben.",
  },
  billing: {
    back: "← Terug naar analyzer", title: "Meer scans kopen",
    youHave: "Je hebt momenteel {n} scans beschikbaar. Vul aan wanneer je wilt — gekochte scans verlopen nooit.",
    adminUnlimited: "Je bent admin — je hebt al onbeperkte scans.", canceled: "Betaling geannuleerd — er is niets afgeschreven.",
    scans: "scans", perScan: "{c}¢ / scan", buy: "Kopen", opening: "Betaling openen…",
    secured: "Betalingen worden veilig verwerkt door Paddle, onze reseller. Kaarten worden nooit op onze servers bewaard.",
  },
  success: {
    successTitle: "Betaling geslaagd", added: "{n} scans toegevoegd aan je account.",
    youNow: "Je hebt nu {n} scans beschikbaar.", almost: "Bijna klaar", start: "Begin met analyseren", buyMore: "Meer kopen",
  },
};

const pl: DeepPartial<Dict> = {
  nav: { signOut: "Wyloguj", buyScans: "Kup skany" },
  home: {
    badge: "Analiza opinii oparta na AI",
    subtitle: "Wklej link do dowolnego produktu. Czytamy prawdziwe opinie klientów za Ciebie — i dajemy prosty werdykt: Kupować / Nie kupować.",
  },
  analyzer: {
    analyze: "Analizuj", analyzing: "Analizuję…", unlimited: "Nielimitowane skany · admin",
    scansLeft: "Pozostało skanów: {n}", noScans: "Brak skanów", buyMore: "Kup więcej",
    loading: "Ładowanie strony → wyodrębnianie opinii → analiza AI…", errorTitle: "Analiza nie powiodła się",
    tryAnother: "Spróbuj innego linku", outTitle: "Skończyły się skany",
    outBody: "Weź pakiet skanów, aby kontynuować — od $1.99 i nigdy nie wygasają.", buyScans: "Kup skany",
    supported: "Działa z Amazon, eBay, Walmart, Best Buy, Rozetka, Comfy i większością stron produktów z publicznymi opiniami.",
  },
  result: {
    product: "Produkt", confidence: "Pewność: {n}%", estRating: "Szac. ocena", reviewsRead: "Przeczytane opinie",
    fakeRisk: "Ryzyko fałszywych opinii", riskLow: "Niskie", riskMedium: "Średnie", riskHigh: "Wysokie",
    sentiment: "Wydźwięk opinii", positive: "pozytywne", neutral: "neutralne", negative: "negatywne",
    bottomLine: "Podsumowanie", love: "Co ludzie lubią", complaints: "Częste skargi", none: "Nie wykryto",
    details: "Szczegółowo", bestFor: "Najlepsze dla", watchOut: "Uważaj na", summary: "Streszczenie",
    authenticity: "Autentyczność", analyzeAnother: "Analizuj kolejny", buy: "KUPUJ", dontBuy: "NIE KUPUJ", mixed: "MIESZANE",
  },
  auth: {
    welcomeBack: "Witaj ponownie", signInSub: "Zaloguj się, aby analizować opinie.", createTitle: "Załóż konto",
    createSub: "Otrzymaj 3 darmowe analizy.", name: "Imię (opcjonalnie)", email: "E-mail", password: "Hasło",
    confirm: "Potwierdź hasło", signIn: "Zaloguj", create: "Załóż konto", pleaseWait: "Proszę czekać…", or: "lub",
    google: "Kontynuuj z Google", noAccount: "Nie masz konta?", signUp: "Zarejestruj się", haveAccount: "Masz już konto?",
    invalid: "Nieprawidłowy e-mail lub hasło.", mismatch: "Hasła nie są zgodne.", short: "Hasło musi mieć co najmniej 8 znaków.",
  },
  billing: {
    back: "← Wróć do analizatora", title: "Kup więcej skanów",
    youHave: "Masz obecnie {n} dostępnych skanów. Doładuj w dowolnej chwili — kupione skany nie wygasają.",
    adminUnlimited: "Jesteś adminem — masz już nielimitowane skany.", canceled: "Płatność anulowana — nie pobrano opłaty.",
    scans: "skanów", perScan: "{c}¢ / skan", buy: "Kup", opening: "Otwieranie płatności…",
    secured: "Płatności bezpiecznie obsługuje Paddle, nasz sprzedawca. Karty nigdy nie są przechowywane na naszych serwerach.",
  },
  success: {
    successTitle: "Płatność udana", added: "Dodano {n} skanów do Twojego konta.",
    youNow: "Masz teraz {n} dostępnych skanów.", almost: "Już prawie", start: "Zacznij analizę", buyMore: "Kup więcej",
  },
};

const sv: DeepPartial<Dict> = {
  nav: { signOut: "Logga ut", buyScans: "Köp skanningar" },
  home: {
    badge: "AI-driven recensionsanalys",
    subtitle: "Klistra in en produkt-URL. Vi läser de riktiga kundrecensionerna åt dig — och ger ett tydligt omdöme: Köp / Köp inte.",
  },
  analyzer: {
    analyze: "Analysera", analyzing: "Analyserar…", unlimited: "Obegränsade skanningar · admin",
    scansLeft: "{n} skanningar kvar", noScans: "Inga skanningar kvar", buyMore: "Köp fler",
    loading: "Hämtar sida → extraherar recensioner → AI-analys…", errorTitle: "Analysen misslyckades",
    tryAnother: "Prova en annan URL", outTitle: "Dina skanningar är slut",
    outBody: "Skaffa ett skanningspaket för att fortsätta — från $1.99 och utgår aldrig.", buyScans: "Köp skanningar",
    supported: "Fungerar med Amazon, eBay, Walmart, Best Buy, Rozetka, Comfy och de flesta produktsidor med offentliga recensioner.",
  },
  result: {
    product: "Produkt", confidence: "{n}% säkerhet", estRating: "Uppsk. betyg", reviewsRead: "Lästa recensioner",
    fakeRisk: "Risk för falska recensioner", riskLow: "Låg", riskMedium: "Medel", riskHigh: "Hög",
    sentiment: "Recensionernas ton", positive: "positiva", neutral: "neutrala", negative: "negativa",
    bottomLine: "Slutsats", love: "Vad folk gillar", complaints: "Vanliga klagomål", none: "Inget hittat",
    details: "I detalj", bestFor: "Bäst för", watchOut: "Se upp för", summary: "Sammanfattning",
    authenticity: "Äkthet", analyzeAnother: "Analysera en till", buy: "KÖP", dontBuy: "KÖP INTE", mixed: "BLANDAT",
  },
  auth: {
    welcomeBack: "Välkommen tillbaka", signInSub: "Logga in för att analysera recensioner.", createTitle: "Skapa ditt konto",
    createSub: "Få 3 gratis analyser.", name: "Namn (valfritt)", email: "E-post", password: "Lösenord",
    confirm: "Bekräfta lösenord", signIn: "Logga in", create: "Skapa konto", pleaseWait: "Vänta…", or: "eller",
    google: "Fortsätt med Google", noAccount: "Har du inget konto?", signUp: "Registrera dig", haveAccount: "Har du redan ett konto?",
    invalid: "Ogiltig e-post eller lösenord.", mismatch: "Lösenorden matchar inte.", short: "Lösenordet måste vara minst 8 tecken.",
  },
  billing: {
    back: "← Tillbaka till analysatorn", title: "Köp fler skanningar",
    youHave: "Du har för närvarande {n} skanningar tillgängliga. Fyll på när du vill — köpta skanningar utgår aldrig.",
    adminUnlimited: "Du är admin — du har redan obegränsade skanningar.", canceled: "Betalning avbruten — du debiterades inte.",
    scans: "skanningar", perScan: "{c}¢ / skanning", buy: "Köp", opening: "Öppnar betalning…",
    secured: "Betalningar hanteras säkert av Paddle, vår återförsäljare. Kort lagras aldrig på våra servrar.",
  },
  success: {
    successTitle: "Betalning genomförd", added: "{n} skanningar har lagts till på ditt konto.",
    youNow: "Du har nu {n} skanningar tillgängliga.", almost: "Nästan klart", start: "Börja analysera", buyMore: "Köp fler",
  },
};

const da: DeepPartial<Dict> = {
  nav: { signOut: "Log ud", buyScans: "Køb scanninger" },
  home: {
    badge: "AI-drevet anmeldelsesanalyse",
    subtitle: "Indsæt en produkt-URL. Vi læser de rigtige kundeanmeldelser for dig — og giver en klar dom: Køb / Køb ikke.",
  },
  analyzer: {
    analyze: "Analysér", analyzing: "Analyserer…", unlimited: "Ubegrænsede scanninger · admin",
    scansLeft: "{n} scanninger tilbage", noScans: "Ingen scanninger tilbage", buyMore: "Køb flere",
    loading: "Henter side → udtrækker anmeldelser → AI-analyse…", errorTitle: "Analysen mislykkedes",
    tryAnother: "Prøv en anden URL", outTitle: "Dine scanninger er brugt op",
    outBody: "Køb en scanningspakke for at fortsætte — fra $1.99 og udløber aldrig.", buyScans: "Køb scanninger",
    supported: "Virker med Amazon, eBay, Walmart, Best Buy, Rozetka, Comfy og de fleste produktsider med offentlige anmeldelser.",
  },
  result: {
    product: "Produkt", confidence: "{n}% sikkerhed", estRating: "Anslået vurdering", reviewsRead: "Læste anmeldelser",
    fakeRisk: "Risiko for falske anmeldelser", riskLow: "Lav", riskMedium: "Mellem", riskHigh: "Høj",
    sentiment: "Anmeldelsernes stemning", positive: "positive", neutral: "neutrale", negative: "negative",
    bottomLine: "Konklusion", love: "Hvad folk elsker", complaints: "Almindelige klager", none: "Intet fundet",
    details: "I detaljer", bestFor: "Bedst til", watchOut: "Pas på", summary: "Resumé",
    authenticity: "Ægthed", analyzeAnother: "Analysér en til", buy: "KØB", dontBuy: "KØB IKKE", mixed: "BLANDET",
  },
  auth: {
    welcomeBack: "Velkommen tilbage", signInSub: "Log ind for at analysere anmeldelser.", createTitle: "Opret din konto",
    createSub: "Få 3 gratis analyser.", name: "Navn (valgfrit)", email: "E-mail", password: "Adgangskode",
    confirm: "Bekræft adgangskode", signIn: "Log ind", create: "Opret konto", pleaseWait: "Vent venligst…", or: "eller",
    google: "Fortsæt med Google", noAccount: "Har du ikke en konto?", signUp: "Tilmeld dig", haveAccount: "Har du allerede en konto?",
    invalid: "Ugyldig e-mail eller adgangskode.", mismatch: "Adgangskoderne stemmer ikke overens.", short: "Adgangskoden skal være mindst 8 tegn.",
  },
  billing: {
    back: "← Tilbage til analysatoren", title: "Køb flere scanninger",
    youHave: "Du har i øjeblikket {n} scanninger til rådighed. Fyld op når som helst — købte scanninger udløber aldrig.",
    adminUnlimited: "Du er admin — du har allerede ubegrænsede scanninger.", canceled: "Betaling annulleret — du blev ikke opkrævet.",
    scans: "scanninger", perScan: "{c}¢ / scanning", buy: "Køb", opening: "Åbner betaling…",
    secured: "Betalinger håndteres sikkert af Paddle, vores forhandler. Kort gemmes aldrig på vores servere.",
  },
  success: {
    successTitle: "Betaling gennemført", added: "{n} scanninger tilføjet til din konto.",
    youNow: "Du har nu {n} scanninger til rådighed.", almost: "Næsten færdig", start: "Begynd at analysere", buyMore: "Køb flere",
  },
};

const fi: DeepPartial<Dict> = {
  nav: { signOut: "Kirjaudu ulos", buyScans: "Osta skannauksia" },
  home: {
    badge: "Tekoälyyn perustuva arvostelujen analyysi",
    subtitle: "Liitä minkä tahansa tuotteen URL. Luemme aidot asiakasarvostelut puolestasi — ja annamme selkeän tuomion: Osta / Älä osta.",
  },
  analyzer: {
    analyze: "Analysoi", analyzing: "Analysoidaan…", unlimited: "Rajattomat skannaukset · ylläpitäjä",
    scansLeft: "{n} skannausta jäljellä", noScans: "Ei skannauksia jäljellä", buyMore: "Osta lisää",
    loading: "Haetaan sivua → poimitaan arvosteluja → tekoälyanalyysi…", errorTitle: "Analyysi epäonnistui",
    tryAnother: "Kokeile toista URL-osoitetta", outTitle: "Skannauksesi loppuivat",
    outBody: "Hanki skannauspaketti jatkaaksesi — alkaen $1.99 eivätkä vanhene koskaan.", buyScans: "Osta skannauksia",
    supported: "Toimii Amazonin, eBayn, Walmartin, Best Buyn, Rozetkan, Comfyn ja useimpien tuotesivujen kanssa, joissa on julkisia arvosteluja.",
  },
  result: {
    product: "Tuote", confidence: "{n}% varmuus", estRating: "Arvioitu arvosana", reviewsRead: "Luetut arvostelut",
    fakeRisk: "Väärennettyjen arvostelujen riski", riskLow: "Matala", riskMedium: "Keskitaso", riskHigh: "Korkea",
    sentiment: "Arvostelujen sävy", positive: "positiivisia", neutral: "neutraaleja", negative: "negatiivisia",
    bottomLine: "Yhteenveto", love: "Mistä ihmiset pitävät", complaints: "Yleiset valitukset", none: "Ei havaittu",
    details: "Yksityiskohdat", bestFor: "Parhaiten sopii", watchOut: "Varo", summary: "Tiivistelmä",
    authenticity: "Aitous", analyzeAnother: "Analysoi toinen", buy: "OSTA", dontBuy: "ÄLÄ OSTA", mixed: "RISTIRIITAINEN",
  },
  auth: {
    welcomeBack: "Tervetuloa takaisin", signInSub: "Kirjaudu sisään analysoidaksesi arvosteluja.", createTitle: "Luo tilisi",
    createSub: "Saat 3 ilmaista analyysiä.", name: "Nimi (valinnainen)", email: "Sähköposti", password: "Salasana",
    confirm: "Vahvista salasana", signIn: "Kirjaudu", create: "Luo tili", pleaseWait: "Odota…", or: "tai",
    google: "Jatka Googlella", noAccount: "Eikö sinulla ole tiliä?", signUp: "Rekisteröidy", haveAccount: "Onko sinulla jo tili?",
    invalid: "Virheellinen sähköposti tai salasana.", mismatch: "Salasanat eivät täsmää.", short: "Salasanan on oltava vähintään 8 merkkiä.",
  },
  billing: {
    back: "← Takaisin analysaattoriin", title: "Osta lisää skannauksia",
    youHave: "Sinulla on tällä hetkellä {n} skannausta käytettävissä. Täydennä milloin tahansa — ostetut skannaukset eivät vanhene.",
    adminUnlimited: "Olet ylläpitäjä — sinulla on jo rajattomat skannaukset.", canceled: "Maksu peruutettu — sinulta ei veloitettu.",
    scans: "skannausta", perScan: "{c}¢ / skannaus", buy: "Osta", opening: "Avataan maksua…",
    secured: "Maksut käsittelee turvallisesti Paddle, jälleenmyyjämme. Kortteja ei koskaan tallenneta palvelimillemme.",
  },
  success: {
    successTitle: "Maksu onnistui", added: "{n} skannausta lisätty tilillesi.",
    youNow: "Sinulla on nyt {n} skannausta käytettävissä.", almost: "Melkein valmis", start: "Aloita analysointi", buyMore: "Osta lisää",
  },
};

const cs: DeepPartial<Dict> = {
  nav: { signOut: "Odhlásit se", buyScans: "Koupit skenování" },
  home: {
    badge: "Analýza recenzí pomocí AI",
    subtitle: "Vložte URL libovolného produktu. Přečteme skutečné zákaznické recenze za vás — a dáme jasný verdikt: Koupit / Nekupovat.",
  },
  analyzer: {
    analyze: "Analyzovat", analyzing: "Analyzuji…", unlimited: "Neomezené skenování · admin",
    scansLeft: "Zbývá skenování: {n}", noScans: "Žádné skenování", buyMore: "Koupit více",
    loading: "Načítání stránky → extrakce recenzí → AI analýza…", errorTitle: "Analýza selhala",
    tryAnother: "Zkuste jinou URL", outTitle: "Došlo vám skenování",
    outBody: "Pořiďte si balíček, abyste mohli pokračovat — od $1.99 a nikdy nevyprší.", buyScans: "Koupit skenování",
    supported: "Funguje s Amazon, eBay, Walmart, Best Buy, Rozetka, Comfy a většinou stránek produktů s veřejnými recenzemi.",
  },
  result: {
    product: "Produkt", confidence: "Jistota: {n}%", estRating: "Odhad. hodnocení", reviewsRead: "Přečtené recenze",
    fakeRisk: "Riziko falešných recenzí", riskLow: "Nízké", riskMedium: "Střední", riskHigh: "Vysoké",
    sentiment: "Nálada recenzí", positive: "pozitivní", neutral: "neutrální", negative: "negativní",
    bottomLine: "Závěr", love: "Co lidé chválí", complaints: "Časté stížnosti", none: "Nic nenalezeno",
    details: "Podrobně", bestFor: "Nejlepší pro", watchOut: "Dejte si pozor na", summary: "Shrnutí",
    authenticity: "Pravost", analyzeAnother: "Analyzovat další", buy: "KOUPIT", dontBuy: "NEKUPOVAT", mixed: "SMÍŠENÉ",
  },
  auth: {
    welcomeBack: "Vítejte zpět", signInSub: "Přihlaste se pro analýzu recenzí.", createTitle: "Vytvořte si účet",
    createSub: "Získejte 3 analýzy zdarma.", name: "Jméno (nepovinné)", email: "E-mail", password: "Heslo",
    confirm: "Potvrďte heslo", signIn: "Přihlásit se", create: "Vytvořit účet", pleaseWait: "Počkejte…", or: "nebo",
    google: "Pokračovat s Google", noAccount: "Nemáte účet?", signUp: "Zaregistrovat se", haveAccount: "Už máte účet?",
    invalid: "Neplatný e-mail nebo heslo.", mismatch: "Hesla se neshodují.", short: "Heslo musí mít alespoň 8 znaků.",
  },
  billing: {
    back: "← Zpět k analyzátoru", title: "Koupit více skenování",
    youHave: "Aktuálně máte k dispozici {n} skenování. Doplňte kdykoli — zakoupená skenování nikdy nevyprší.",
    adminUnlimited: "Jste admin — už máte neomezené skenování.", canceled: "Platba zrušena — nic vám nebylo účtováno.",
    scans: "skenování", perScan: "{c}¢ / skenování", buy: "Koupit", opening: "Otevírám platbu…",
    secured: "Platby bezpečně zpracovává Paddle, náš prodejce. Karty se na našich serverech nikdy neukládají.",
  },
  success: {
    successTitle: "Platba úspěšná", added: "Na váš účet bylo přidáno skenování: {n}.",
    youNow: "Nyní máte k dispozici {n} skenování.", almost: "Téměř hotovo", start: "Začít analyzovat", buyMore: "Koupit více",
  },
};

const sk: DeepPartial<Dict> = {
  nav: { signOut: "Odhlásiť sa", buyScans: "Kúpiť skenovania" },
  home: {
    badge: "Analýza recenzií pomocou AI",
    subtitle: "Vložte URL ľubovoľného produktu. Prečítame skutočné zákaznícke recenzie za vás — a dáme jasný verdikt: Kúpiť / Nekupovať.",
  },
  analyzer: {
    analyze: "Analyzovať", analyzing: "Analyzujem…", unlimited: "Neobmedzené skenovania · admin",
    scansLeft: "Zostáva skenovaní: {n}", noScans: "Žiadne skenovania", buyMore: "Kúpiť viac",
    loading: "Načítavanie stránky → extrakcia recenzií → AI analýza…", errorTitle: "Analýza zlyhala",
    tryAnother: "Skúste inú URL", outTitle: "Minuli sa vám skenovania",
    outBody: "Zaobstarajte si balík, aby ste mohli pokračovať — od $1.99 a nikdy nevyprší.", buyScans: "Kúpiť skenovania",
    supported: "Funguje s Amazon, eBay, Walmart, Best Buy, Rozetka, Comfy a väčšinou stránok produktov s verejnými recenziami.",
  },
  result: {
    product: "Produkt", confidence: "Istota: {n}%", estRating: "Odhad. hodnotenie", reviewsRead: "Prečítané recenzie",
    fakeRisk: "Riziko falošných recenzií", riskLow: "Nízke", riskMedium: "Stredné", riskHigh: "Vysoké",
    sentiment: "Nálada recenzií", positive: "pozitívne", neutral: "neutrálne", negative: "negatívne",
    bottomLine: "Záver", love: "Čo ľudia chvália", complaints: "Časté sťažnosti", none: "Nič nenájdené",
    details: "Podrobne", bestFor: "Najlepšie pre", watchOut: "Dajte si pozor na", summary: "Zhrnutie",
    authenticity: "Pravosť", analyzeAnother: "Analyzovať ďalší", buy: "KÚPIŤ", dontBuy: "NEKUPOVAŤ", mixed: "ZMIEŠANÉ",
  },
  auth: {
    welcomeBack: "Vitajte späť", signInSub: "Prihláste sa pre analýzu recenzií.", createTitle: "Vytvorte si účet",
    createSub: "Získajte 3 analýzy zadarmo.", name: "Meno (nepovinné)", email: "E-mail", password: "Heslo",
    confirm: "Potvrďte heslo", signIn: "Prihlásiť sa", create: "Vytvoriť účet", pleaseWait: "Čakajte…", or: "alebo",
    google: "Pokračovať cez Google", noAccount: "Nemáte účet?", signUp: "Zaregistrovať sa", haveAccount: "Už máte účet?",
    invalid: "Neplatný e-mail alebo heslo.", mismatch: "Heslá sa nezhodujú.", short: "Heslo musí mať aspoň 8 znakov.",
  },
  billing: {
    back: "← Späť k analyzátoru", title: "Kúpiť viac skenovaní",
    youHave: "Aktuálne máte k dispozícii {n} skenovaní. Doplňte kedykoľvek — zakúpené skenovania nikdy nevypršia.",
    adminUnlimited: "Ste admin — už máte neobmedzené skenovania.", canceled: "Platba zrušená — nič vám nebolo účtované.",
    scans: "skenovaní", perScan: "{c}¢ / skenovanie", buy: "Kúpiť", opening: "Otváram platbu…",
    secured: "Platby bezpečne spracúva Paddle, náš predajca. Karty sa na našich serveroch nikdy neukladajú.",
  },
  success: {
    successTitle: "Platba úspešná", added: "Na váš účet bolo pridaných skenovaní: {n}.",
    youNow: "Teraz máte k dispozícii {n} skenovaní.", almost: "Takmer hotovo", start: "Začať analyzovať", buyMore: "Kúpiť viac",
  },
};

const ro: DeepPartial<Dict> = {
  nav: { signOut: "Deconectare", buyScans: "Cumpără scanări" },
  home: {
    badge: "Analiză a recenziilor cu IA",
    subtitle: "Lipește URL-ul oricărui produs. Citim recenziile reale ale clienților în locul tău — și îți dăm un verdict clar: Cumpără / Nu cumpăra.",
  },
  analyzer: {
    analyze: "Analizează", analyzing: "Se analizează…", unlimited: "Scanări nelimitate · admin",
    scansLeft: "{n} scanări rămase", noScans: "Nu mai ai scanări", buyMore: "Cumpără mai multe",
    loading: "Se încarcă pagina → se extrag recenziile → analiză IA…", errorTitle: "Analiza a eșuat",
    tryAnother: "Încearcă alt URL", outTitle: "Ți s-au terminat scanările",
    outBody: "Ia un pachet de scanări ca să continui — de la $1.99 și nu expiră niciodată.", buyScans: "Cumpără scanări",
    supported: "Funcționează cu Amazon, eBay, Walmart, Best Buy, Rozetka, Comfy și majoritatea paginilor de produs cu recenzii publice.",
  },
  result: {
    product: "Produs", confidence: "{n}% încredere", estRating: "Rating estimat", reviewsRead: "Recenzii citite",
    fakeRisk: "Risc de recenzii false", riskLow: "Scăzut", riskMedium: "Mediu", riskHigh: "Ridicat",
    sentiment: "Tonul recenziilor", positive: "pozitive", neutral: "neutre", negative: "negative",
    bottomLine: "Concluzie", love: "Ce le place oamenilor", complaints: "Plângeri frecvente", none: "Nimic identificat",
    details: "În detaliu", bestFor: "Ideal pentru", watchOut: "Atenție la", summary: "Rezumat",
    authenticity: "Autenticitate", analyzeAnother: "Analizează altul", buy: "CUMPĂRĂ", dontBuy: "NU CUMPĂRA", mixed: "MIXT",
  },
  auth: {
    welcomeBack: "Bine ai revenit", signInSub: "Conectează-te pentru a analiza recenzii.", createTitle: "Creează-ți contul",
    createSub: "Primește 3 analize gratuite.", name: "Nume (opțional)", email: "E-mail", password: "Parolă",
    confirm: "Confirmă parola", signIn: "Conectare", create: "Creează cont", pleaseWait: "Așteaptă…", or: "sau",
    google: "Continuă cu Google", noAccount: "Nu ai cont?", signUp: "Înregistrează-te", haveAccount: "Ai deja cont?",
    invalid: "E-mail sau parolă invalide.", mismatch: "Parolele nu se potrivesc.", short: "Parola trebuie să aibă cel puțin 8 caractere.",
  },
  billing: {
    back: "← Înapoi la analizor", title: "Cumpără mai multe scanări",
    youHave: "Ai în prezent {n} scanări disponibile. Reîncarcă oricând — scanările cumpărate nu expiră niciodată.",
    adminUnlimited: "Ești admin — ai deja scanări nelimitate.", canceled: "Plată anulată — nu ai fost taxat.",
    scans: "scanări", perScan: "{c}¢ / scanare", buy: "Cumpără", opening: "Se deschide plata…",
    secured: "Plățile sunt procesate în siguranță de Paddle, distribuitorul nostru. Cardurile nu sunt niciodată stocate pe serverele noastre.",
  },
  success: {
    successTitle: "Plată reușită", added: "{n} scanări adăugate în contul tău.",
    youNow: "Acum ai {n} scanări disponibile.", almost: "Aproape gata", start: "Începe analiza", buyMore: "Cumpără mai multe",
  },
};

const el: DeepPartial<Dict> = {
  nav: { signOut: "Αποσύνδεση", buyScans: "Αγορά σαρώσεων" },
  home: {
    badge: "Ανάλυση κριτικών με ΤΝ",
    subtitle: "Επικολλήστε το URL οποιουδήποτε προϊόντος. Διαβάζουμε τις πραγματικές κριτικές πελατών για εσάς — και δίνουμε ξεκάθαρη ετυμηγορία: Αγορά / Όχι αγορά.",
  },
  analyzer: {
    analyze: "Ανάλυση", analyzing: "Ανάλυση…", unlimited: "Απεριόριστες σαρώσεις · διαχειριστής",
    scansLeft: "Απομένουν σαρώσεις: {n}", noScans: "Δεν απομένουν σαρώσεις", buyMore: "Αγορά περισσότερων",
    loading: "Φόρτωση σελίδας → εξαγωγή κριτικών → ανάλυση ΤΝ…", errorTitle: "Η ανάλυση απέτυχε",
    tryAnother: "Δοκιμάστε άλλο URL", outTitle: "Εξαντλήθηκαν οι σαρώσεις σας",
    outBody: "Αποκτήστε ένα πακέτο για να συνεχίσετε — από $1.99 και δεν λήγουν ποτέ.", buyScans: "Αγορά σαρώσεων",
    supported: "Λειτουργεί με Amazon, eBay, Walmart, Best Buy, Rozetka, Comfy και τις περισσότερες σελίδες προϊόντων με δημόσιες κριτικές.",
  },
  result: {
    product: "Προϊόν", confidence: "{n}% βεβαιότητα", estRating: "Εκτιμ. βαθμολογία", reviewsRead: "Κριτικές που διαβάστηκαν",
    fakeRisk: "Κίνδυνος ψεύτικων κριτικών", riskLow: "Χαμηλός", riskMedium: "Μέτριος", riskHigh: "Υψηλός",
    sentiment: "Διάθεση κριτικών", positive: "θετικές", neutral: "ουδέτερες", negative: "αρνητικές",
    bottomLine: "Συμπέρασμα", love: "Τι αρέσει στους ανθρώπους", complaints: "Συχνά παράπονα", none: "Δεν εντοπίστηκε",
    details: "Στις λεπτομέρειες", bestFor: "Ιδανικό για", watchOut: "Προσοχή σε", summary: "Περίληψη",
    authenticity: "Γνησιότητα", analyzeAnother: "Ανάλυση άλλου", buy: "ΑΓΟΡΑ", dontBuy: "ΟΧΙ ΑΓΟΡΑ", mixed: "ΜΙΚΤΟ",
  },
  auth: {
    welcomeBack: "Καλώς ήρθατε ξανά", signInSub: "Συνδεθείτε για να αναλύσετε κριτικές.", createTitle: "Δημιουργήστε λογαριασμό",
    createSub: "Λάβετε 3 δωρεάν αναλύσεις.", name: "Όνομα (προαιρετικό)", email: "Email", password: "Κωδικός",
    confirm: "Επιβεβαίωση κωδικού", signIn: "Σύνδεση", create: "Δημιουργία λογαριασμού", pleaseWait: "Περιμένετε…", or: "ή",
    google: "Συνέχεια με Google", noAccount: "Δεν έχετε λογαριασμό;", signUp: "Εγγραφή", haveAccount: "Έχετε ήδη λογαριασμό;",
    invalid: "Μη έγκυρο email ή κωδικός.", mismatch: "Οι κωδικοί δεν ταιριάζουν.", short: "Ο κωδικός πρέπει να έχει τουλάχιστον 8 χαρακτήρες.",
  },
  billing: {
    back: "← Πίσω στον αναλυτή", title: "Αγορά περισσότερων σαρώσεων",
    youHave: "Έχετε αυτή τη στιγμή {n} σαρώσεις διαθέσιμες. Ανανεώστε όποτε θέλετε — οι αγορασμένες σαρώσεις δεν λήγουν ποτέ.",
    adminUnlimited: "Είστε διαχειριστής — έχετε ήδη απεριόριστες σαρώσεις.", canceled: "Η πληρωμή ακυρώθηκε — δεν χρεωθήκατε.",
    scans: "σαρώσεις", perScan: "{c}¢ / σάρωση", buy: "Αγορά", opening: "Άνοιγμα πληρωμής…",
    secured: "Οι πληρωμές γίνονται με ασφάλεια από την Paddle, τον μεταπωλητή μας. Οι κάρτες δεν αποθηκεύονται ποτέ στους διακομιστές μας.",
  },
  success: {
    successTitle: "Επιτυχής πληρωμή", added: "Προστέθηκαν {n} σαρώσεις στον λογαριασμό σας.",
    youNow: "Τώρα έχετε {n} σαρώσεις διαθέσιμες.", almost: "Σχεδόν τελειώσαμε", start: "Ξεκινήστε ανάλυση", buyMore: "Αγορά περισσότερων",
  },
};

const hu: DeepPartial<Dict> = {
  nav: { signOut: "Kijelentkezés", buyScans: "Szkennelések vásárlása" },
  home: {
    badge: "MI-alapú véleményelemzés",
    subtitle: "Illessz be bármilyen termék URL-t. Elolvassuk helyetted a valódi vásárlói véleményeket — és világos ítéletet adunk: Vedd meg / Ne vedd meg.",
  },
  analyzer: {
    analyze: "Elemzés", analyzing: "Elemzés…", unlimited: "Korlátlan szkennelés · admin",
    scansLeft: "Hátralévő szkennelés: {n}", noScans: "Nincs több szkennelés", buyMore: "Vásárolj többet",
    loading: "Oldal betöltése → vélemények kinyerése → MI-elemzés…", errorTitle: "Az elemzés sikertelen",
    tryAnother: "Próbálj másik URL-t", outTitle: "Elfogytak a szkenneléseid",
    outBody: "Vegyél egy csomagot a folytatáshoz — $1.99-tól, és sosem jár le.", buyScans: "Szkennelések vásárlása",
    supported: "Működik az Amazon, eBay, Walmart, Best Buy, Rozetka, Comfy és a legtöbb nyilvános véleményekkel rendelkező termékoldal esetén.",
  },
  result: {
    product: "Termék", confidence: "{n}% biztonság", estRating: "Becsült értékelés", reviewsRead: "Elolvasott vélemények",
    fakeRisk: "Hamis vélemények kockázata", riskLow: "Alacsony", riskMedium: "Közepes", riskHigh: "Magas",
    sentiment: "Vélemények hangulata", positive: "pozitív", neutral: "semleges", negative: "negatív",
    bottomLine: "Összegzés", love: "Amit szeretnek", complaints: "Gyakori panaszok", none: "Nem található",
    details: "Részletesen", bestFor: "Ideális ehhez", watchOut: "Figyelj erre", summary: "Áttekintés",
    authenticity: "Hitelesség", analyzeAnother: "Másik elemzése", buy: "VEDD MEG", dontBuy: "NE VEDD MEG", mixed: "VEGYES",
  },
  auth: {
    welcomeBack: "Üdv újra", signInSub: "Jelentkezz be vélemények elemzéséhez.", createTitle: "Hozz létre fiókot",
    createSub: "Kapj 3 ingyenes elemzést.", name: "Név (opcionális)", email: "E-mail", password: "Jelszó",
    confirm: "Jelszó megerősítése", signIn: "Bejelentkezés", create: "Fiók létrehozása", pleaseWait: "Kérlek, várj…", or: "vagy",
    google: "Folytatás Google-lal", noAccount: "Nincs fiókod?", signUp: "Regisztráció", haveAccount: "Már van fiókod?",
    invalid: "Érvénytelen e-mail vagy jelszó.", mismatch: "A jelszavak nem egyeznek.", short: "A jelszónak legalább 8 karakterből kell állnia.",
  },
  billing: {
    back: "← Vissza az elemzőhöz", title: "Vásárolj több szkennelést",
    youHave: "Jelenleg {n} szkennelés áll rendelkezésedre. Tölts fel bármikor — a megvásárolt szkennelések sosem járnak le.",
    adminUnlimited: "Admin vagy — már korlátlan szkenneléseid vannak.", canceled: "Fizetés megszakítva — nem terheltünk meg.",
    scans: "szkennelés", perScan: "{c}¢ / szkennelés", buy: "Vásárlás", opening: "Fizetés megnyitása…",
    secured: "A fizetéseket biztonságosan a Paddle, viszonteladónk kezeli. A kártyákat sosem tároljuk a szerverünkön.",
  },
  success: {
    successTitle: "Sikeres fizetés", added: "{n} szkennelés hozzáadva a fiókodhoz.",
    youNow: "Most {n} szkennelés áll rendelkezésedre.", almost: "Majdnem kész", start: "Kezdj elemezni", buyMore: "Vásárolj többet",
  },
};

const bg: DeepPartial<Dict> = {
  nav: { signOut: "Изход", buyScans: "Купи сканирания" },
  home: {
    badge: "Анализ на отзиви с ИИ",
    subtitle: "Поставете URL на който и да е продукт. Четем истинските клиентски отзиви вместо вас — и даваме ясна присъда: Купи / Не купувай.",
  },
  analyzer: {
    analyze: "Анализирай", analyzing: "Анализиране…", unlimited: "Неограничени сканирания · админ",
    scansLeft: "Оставащи сканирания: {n}", noScans: "Няма повече сканирания", buyMore: "Купи още",
    loading: "Зареждане на страницата → извличане на отзиви → ИИ анализ…", errorTitle: "Анализът неуспешен",
    tryAnother: "Опитайте друг URL", outTitle: "Изчерпахте сканиранията си",
    outBody: "Вземете пакет, за да продължите — от $1.99 и никога не изтичат.", buyScans: "Купи сканирания",
    supported: "Работи с Amazon, eBay, Walmart, Best Buy, Rozetka, Comfy и повечето продуктови страници с публични отзиви.",
  },
  result: {
    product: "Продукт", confidence: "{n}% увереност", estRating: "Прибл. оценка", reviewsRead: "Прочетени отзиви",
    fakeRisk: "Риск от фалшиви отзиви", riskLow: "Нисък", riskMedium: "Среден", riskHigh: "Висок",
    sentiment: "Настроение на отзивите", positive: "положителни", neutral: "неутрални", negative: "отрицателни",
    bottomLine: "Заключение", love: "Какво харесват хората", complaints: "Чести оплаквания", none: "Нищо открито",
    details: "По детайли", bestFor: "Подходящо за", watchOut: "Внимавайте за", summary: "Обобщение",
    authenticity: "Достоверност", analyzeAnother: "Анализирай друг", buy: "КУПИ", dontBuy: "НЕ КУПУВАЙ", mixed: "СМЕСЕНО",
  },
  auth: {
    welcomeBack: "Добре дошли отново", signInSub: "Влезте, за да анализирате отзиви.", createTitle: "Създайте акаунт",
    createSub: "Получете 3 безплатни анализа.", name: "Име (по желание)", email: "Имейл", password: "Парола",
    confirm: "Потвърдете паролата", signIn: "Вход", create: "Създай акаунт", pleaseWait: "Моля, изчакайте…", or: "или",
    google: "Продължи с Google", noAccount: "Нямате акаунт?", signUp: "Регистрация", haveAccount: "Вече имате акаунт?",
    invalid: "Невалиден имейл или парола.", mismatch: "Паролите не съвпадат.", short: "Паролата трябва да е поне 8 знака.",
  },
  billing: {
    back: "← Назад към анализатора", title: "Купи още сканирания",
    youHave: "В момента имате {n} налични сканирания. Презаредете по всяко време — закупените сканирания никога не изтичат.",
    adminUnlimited: "Вие сте админ — вече имате неограничени сканирания.", canceled: "Плащането е отменено — не сте таксувани.",
    scans: "сканирания", perScan: "{c}¢ / сканиране", buy: "Купи", opening: "Отваряне на плащането…",
    secured: "Плащанията се обработват сигурно от Paddle, нашия дистрибутор. Картите никога не се съхраняват на нашите сървъри.",
  },
  success: {
    successTitle: "Успешно плащане", added: "Добавени са {n} сканирания към акаунта ви.",
    youNow: "Сега имате {n} налични сканирания.", almost: "Почти готово", start: "Започни анализ", buyMore: "Купи още",
  },
};

const hr: DeepPartial<Dict> = {
  nav: { signOut: "Odjava", buyScans: "Kupi skeniranja" },
  home: {
    badge: "Analiza recenzija pomoću UI",
    subtitle: "Zalijepite URL bilo kojeg proizvoda. Čitamo prave recenzije kupaca umjesto vas — i dajemo jasnu presudu: Kupiti / Ne kupovati.",
  },
  analyzer: {
    analyze: "Analiziraj", analyzing: "Analiziram…", unlimited: "Neograničena skeniranja · admin",
    scansLeft: "Preostalo skeniranja: {n}", noScans: "Nema više skeniranja", buyMore: "Kupi više",
    loading: "Učitavanje stranice → izvlačenje recenzija → UI analiza…", errorTitle: "Analiza nije uspjela",
    tryAnother: "Pokušajte drugi URL", outTitle: "Potrošili ste skeniranja",
    outBody: "Nabavite paket za nastavak — od $1.99 i nikad ne istječu.", buyScans: "Kupi skeniranja",
    supported: "Radi s Amazon, eBay, Walmart, Best Buy, Rozetka, Comfy i većinom stranica proizvoda s javnim recenzijama.",
  },
  result: {
    product: "Proizvod", confidence: "{n}% sigurnosti", estRating: "Procij. ocjena", reviewsRead: "Pročitane recenzije",
    fakeRisk: "Rizik lažnih recenzija", riskLow: "Nizak", riskMedium: "Srednji", riskHigh: "Visok",
    sentiment: "Ton recenzija", positive: "pozitivne", neutral: "neutralne", negative: "negativne",
    bottomLine: "Zaključak", love: "Što ljudi vole", complaints: "Česte pritužbe", none: "Ništa pronađeno",
    details: "U detalje", bestFor: "Najbolje za", watchOut: "Pazite na", summary: "Sažetak",
    authenticity: "Vjerodostojnost", analyzeAnother: "Analiziraj drugi", buy: "KUPI", dontBuy: "NE KUPUJ", mixed: "MJEŠOVITO",
  },
  auth: {
    welcomeBack: "Dobrodošli natrag", signInSub: "Prijavite se za analizu recenzija.", createTitle: "Stvorite račun",
    createSub: "Dobijte 3 besplatne analize.", name: "Ime (neobavezno)", email: "E-mail", password: "Lozinka",
    confirm: "Potvrdite lozinku", signIn: "Prijava", create: "Stvori račun", pleaseWait: "Pričekajte…", or: "ili",
    google: "Nastavi s Google", noAccount: "Nemate račun?", signUp: "Registrirajte se", haveAccount: "Već imate račun?",
    invalid: "Nevažeći e-mail ili lozinka.", mismatch: "Lozinke se ne podudaraju.", short: "Lozinka mora imati najmanje 8 znakova.",
  },
  billing: {
    back: "← Natrag na analizator", title: "Kupi više skeniranja",
    youHave: "Trenutno imate {n} dostupnih skeniranja. Nadopunite bilo kada — kupljena skeniranja nikad ne istječu.",
    adminUnlimited: "Vi ste admin — već imate neograničena skeniranja.", canceled: "Plaćanje otkazano — niste naplaćeni.",
    scans: "skeniranja", perScan: "{c}¢ / skeniranje", buy: "Kupi", opening: "Otvaranje plaćanja…",
    secured: "Plaćanja sigurno obrađuje Paddle, naš preprodavač. Kartice se nikad ne pohranjuju na našim poslužiteljima.",
  },
  success: {
    successTitle: "Plaćanje uspješno", added: "Dodano je {n} skeniranja na vaš račun.",
    youNow: "Sada imate {n} dostupnih skeniranja.", almost: "Gotovo", start: "Započni analizu", buyMore: "Kupi više",
  },
};

const sl: DeepPartial<Dict> = {
  nav: { signOut: "Odjava", buyScans: "Kupi skeniranja" },
  home: {
    badge: "Analiza ocen z UI",
    subtitle: "Prilepite URL katerega koli izdelka. Namesto vas preberemo prave ocene strank — in podamo jasno sodbo: Kupi / Ne kupuj.",
  },
  analyzer: {
    analyze: "Analiziraj", analyzing: "Analiziram…", unlimited: "Neomejena skeniranja · skrbnik",
    scansLeft: "Preostala skeniranja: {n}", noScans: "Ni več skeniranj", buyMore: "Kupi več",
    loading: "Nalaganje strani → pridobivanje ocen → UI analiza…", errorTitle: "Analiza ni uspela",
    tryAnother: "Poskusite drug URL", outTitle: "Skeniranja so porabljena",
    outBody: "Kupite paket za nadaljevanje — od $1.99 in nikoli ne potečejo.", buyScans: "Kupi skeniranja",
    supported: "Deluje z Amazon, eBay, Walmart, Best Buy, Rozetka, Comfy in večino strani izdelkov z javnimi ocenami.",
  },
  result: {
    product: "Izdelek", confidence: "{n}% zaupanja", estRating: "Ocenj. ocena", reviewsRead: "Prebrane ocene",
    fakeRisk: "Tveganje lažnih ocen", riskLow: "Nizko", riskMedium: "Srednje", riskHigh: "Visoko",
    sentiment: "Razpoloženje ocen", positive: "pozitivne", neutral: "nevtralne", negative: "negativne",
    bottomLine: "Zaključek", love: "Kaj ljudje cenijo", complaints: "Pogoste pritožbe", none: "Nič najdenega",
    details: "Podrobno", bestFor: "Najboljše za", watchOut: "Pazite na", summary: "Povzetek",
    authenticity: "Pristnost", analyzeAnother: "Analiziraj drugega", buy: "KUPI", dontBuy: "NE KUPUJ", mixed: "MEŠANO",
  },
  auth: {
    welcomeBack: "Dobrodošli nazaj", signInSub: "Prijavite se za analizo ocen.", createTitle: "Ustvarite račun",
    createSub: "Pridobite 3 brezplačne analize.", name: "Ime (neobvezno)", email: "E-pošta", password: "Geslo",
    confirm: "Potrdite geslo", signIn: "Prijava", create: "Ustvari račun", pleaseWait: "Počakajte…", or: "ali",
    google: "Nadaljuj z Google", noAccount: "Nimate računa?", signUp: "Registracija", haveAccount: "Že imate račun?",
    invalid: "Neveljaven e-naslov ali geslo.", mismatch: "Gesli se ne ujemata.", short: "Geslo mora imeti vsaj 8 znakov.",
  },
  billing: {
    back: "← Nazaj na analizator", title: "Kupi več skeniranj",
    youHave: "Trenutno imate na voljo {n} skeniranj. Napolnite kadar koli — kupljena skeniranja nikoli ne potečejo.",
    adminUnlimited: "Ste skrbnik — že imate neomejena skeniranja.", canceled: "Plačilo preklicano — niste bili obremenjeni.",
    scans: "skeniranja", perScan: "{c}¢ / skeniranje", buy: "Kupi", opening: "Odpiranje plačila…",
    secured: "Plačila varno obdeluje Paddle, naš preprodajalec. Kartice se nikoli ne shranjujejo na naših strežnikih.",
  },
  success: {
    successTitle: "Plačilo uspešno", added: "Na vaš račun je bilo dodanih {n} skeniranj.",
    youNow: "Zdaj imate na voljo {n} skeniranj.", almost: "Skoraj končano", start: "Začni analizo", buyMore: "Kupi več",
  },
};

const et: DeepPartial<Dict> = {
  nav: { signOut: "Logi välja", buyScans: "Osta skaneeringuid" },
  home: {
    badge: "Tehisintellektil põhinev arvustuste analüüs",
    subtitle: "Kleebi mis tahes toote URL. Loeme päris klientide arvustused sinu eest läbi — ja anname selge otsuse: Osta / Ära osta.",
  },
  analyzer: {
    analyze: "Analüüsi", analyzing: "Analüüsin…", unlimited: "Piiramatud skaneeringud · admin",
    scansLeft: "Skaneeringuid jäänud: {n}", noScans: "Skaneeringuid pole", buyMore: "Osta veel",
    errorTitle: "Analüüs ebaõnnestus", tryAnother: "Proovi teist URL-i", outTitle: "Sinu skaneeringud on otsas",
    buyScans: "Osta skaneeringuid",
  },
  result: {
    product: "Toode", confidence: "{n}% kindlus", estRating: "Hinnang. reiting", reviewsRead: "Loetud arvustused",
    fakeRisk: "Võltsarvustuste risk", riskLow: "Madal", riskMedium: "Keskmine", riskHigh: "Kõrge",
    sentiment: "Arvustuste meelestatus", positive: "positiivsed", neutral: "neutraalsed", negative: "negatiivsed",
    bottomLine: "Kokkuvõte", love: "Mis meeldib", complaints: "Sagedased kaebused", none: "Midagi ei leitud",
    details: "Üksikasjalikult", bestFor: "Parim", watchOut: "Pane tähele", summary: "Ülevaade",
    authenticity: "Ehtsus", analyzeAnother: "Analüüsi teist", buy: "OSTA", dontBuy: "ÄRA OSTA", mixed: "SEGANE",
  },
  auth: {
    welcomeBack: "Tere tulemast tagasi", createTitle: "Loo konto", name: "Nimi (valikuline)", email: "E-post",
    password: "Parool", confirm: "Kinnita parool", signIn: "Logi sisse", create: "Loo konto", pleaseWait: "Palun oota…",
    or: "või", google: "Jätka Google'iga", signUp: "Registreeru", invalid: "Vale e-post või parool.",
    mismatch: "Paroolid ei ühti.", short: "Parool peab olema vähemalt 8 tähemärki.",
  },
  billing: {
    back: "← Tagasi analüsaatorisse", title: "Osta rohkem skaneeringuid", scans: "skaneeringut",
    perScan: "{c}¢ / skaneering", buy: "Osta", opening: "Avan makse…",
  },
  success: { successTitle: "Makse õnnestus", almost: "Peaaegu valmis", start: "Alusta analüüsi", buyMore: "Osta veel" },
};

const lv: DeepPartial<Dict> = {
  nav: { signOut: "Iziet", buyScans: "Pirkt skenēšanas" },
  home: {
    badge: "AI darbināta atsauksmju analīze",
    subtitle: "Ielīmējiet jebkura produkta URL. Mēs jūsu vietā izlasām īstas klientu atsauksmes — un sniedzam skaidru spriedumu: Pirkt / Nepirkt.",
  },
  analyzer: {
    analyze: "Analizēt", analyzing: "Analizē…", unlimited: "Neierobežotas skenēšanas · admins",
    scansLeft: "Atlikušas skenēšanas: {n}", noScans: "Nav vairāk skenēšanu", buyMore: "Pirkt vairāk",
    errorTitle: "Analīze neizdevās", tryAnother: "Mēģiniet citu URL", outTitle: "Jūsu skenēšanas ir beigušās",
    buyScans: "Pirkt skenēšanas",
  },
  result: {
    product: "Produkts", confidence: "{n}% pārliecība", estRating: "Aptuv. vērtējums", reviewsRead: "Izlasītās atsauksmes",
    fakeRisk: "Viltus atsauksmju risks", riskLow: "Zems", riskMedium: "Vidējs", riskHigh: "Augsts",
    sentiment: "Atsauksmju noskaņojums", positive: "pozitīvas", neutral: "neitrālas", negative: "negatīvas",
    bottomLine: "Secinājums", love: "Kas patīk", complaints: "Biežas sūdzības", none: "Nekas nav atrasts",
    details: "Detalizēti", bestFor: "Vislabāk piemērots", watchOut: "Uzmanieties no", summary: "Kopsavilkums",
    authenticity: "Autentiskums", analyzeAnother: "Analizēt citu", buy: "PIRKT", dontBuy: "NEPIRKT", mixed: "JAUKTS",
  },
  auth: {
    welcomeBack: "Laipni lūdzam atpakaļ", createTitle: "Izveidojiet kontu", name: "Vārds (neobligāts)", email: "E-pasts",
    password: "Parole", confirm: "Apstipriniet paroli", signIn: "Pieslēgties", create: "Izveidot kontu", pleaseWait: "Lūdzu, uzgaidiet…",
    or: "vai", google: "Turpināt ar Google", signUp: "Reģistrēties", invalid: "Nederīgs e-pasts vai parole.",
    mismatch: "Paroles nesakrīt.", short: "Parolei jābūt vismaz 8 rakstzīmēm.",
  },
  billing: {
    back: "← Atpakaļ uz analizatoru", title: "Pirkt vairāk skenēšanu", scans: "skenēšanas",
    perScan: "{c}¢ / skenēšana", buy: "Pirkt", opening: "Atver maksājumu…",
  },
  success: { successTitle: "Maksājums veiksmīgs", almost: "Gandrīz pabeigts", start: "Sākt analīzi", buyMore: "Pirkt vairāk" },
};

const lt: DeepPartial<Dict> = {
  nav: { signOut: "Atsijungti", buyScans: "Pirkti skenavimus" },
  home: {
    badge: "DI pagrįsta atsiliepimų analizė",
    subtitle: "Įklijuokite bet kurio produkto URL. Perskaitome tikrus klientų atsiliepimus už jus — ir pateikiame aiškų verdiktą: Pirkti / Nepirkti.",
  },
  analyzer: {
    analyze: "Analizuoti", analyzing: "Analizuojama…", unlimited: "Neriboti skenavimai · administratorius",
    scansLeft: "Liko skenavimų: {n}", noScans: "Skenavimų nebeliko", buyMore: "Pirkti daugiau",
    errorTitle: "Analizė nepavyko", tryAnother: "Bandykite kitą URL", outTitle: "Skenavimai baigėsi",
    buyScans: "Pirkti skenavimus",
  },
  result: {
    product: "Produktas", confidence: "{n}% tikrumas", estRating: "Apytiksl. įvertinimas", reviewsRead: "Perskaityti atsiliepimai",
    fakeRisk: "Netikrų atsiliepimų rizika", riskLow: "Žema", riskMedium: "Vidutinė", riskHigh: "Aukšta",
    sentiment: "Atsiliepimų nuotaika", positive: "teigiami", neutral: "neutralūs", negative: "neigiami",
    bottomLine: "Išvada", love: "Kas patinka", complaints: "Dažni nusiskundimai", none: "Nieko nerasta",
    details: "Detaliau", bestFor: "Geriausiai tinka", watchOut: "Atkreipkite dėmesį", summary: "Santrauka",
    authenticity: "Autentiškumas", analyzeAnother: "Analizuoti kitą", buy: "PIRKTI", dontBuy: "NEPIRKTI", mixed: "MIŠRUS",
  },
  auth: {
    welcomeBack: "Sveiki sugrįžę", createTitle: "Sukurkite paskyrą", name: "Vardas (neprivaloma)", email: "El. paštas",
    password: "Slaptažodis", confirm: "Patvirtinkite slaptažodį", signIn: "Prisijungti", create: "Sukurti paskyrą", pleaseWait: "Palaukite…",
    or: "arba", google: "Tęsti su Google", signUp: "Registruotis", invalid: "Neteisingas el. paštas arba slaptažodis.",
    mismatch: "Slaptažodžiai nesutampa.", short: "Slaptažodį turi sudaryti bent 8 simboliai.",
  },
  billing: {
    back: "← Atgal į analizatorių", title: "Pirkti daugiau skenavimų", scans: "skenavimų",
    perScan: "{c}¢ / skenavimas", buy: "Pirkti", opening: "Atveriamas mokėjimas…",
  },
  success: { successTitle: "Mokėjimas sėkmingas", almost: "Beveik baigta", start: "Pradėti analizę", buyMore: "Pirkti daugiau" },
};

const ga: DeepPartial<Dict> = {
  nav: { signOut: "Logáil amach", buyScans: "Ceannaigh scananna" },
  home: { badge: "Anailís léirmheasanna le IS" },
  analyzer: {
    analyze: "Anailísigh", analyzing: "Ag anailísiú…", unlimited: "Scananna gan teorainn · riarthóir",
    scansLeft: "Scananna fágtha: {n}", noScans: "Níl aon scan fágtha", buyMore: "Ceannaigh tuilleadh",
    errorTitle: "Theip ar an anailís", tryAnother: "Bain triail as URL eile", buyScans: "Ceannaigh scananna",
  },
  result: {
    product: "Táirge", riskLow: "Íseal", riskMedium: "Meánach", riskHigh: "Ard",
    positive: "dearfach", neutral: "neodrach", negative: "diúltach",
    summary: "Achoimre", bestFor: "Is fearr do", analyzeAnother: "Anailísigh ceann eile",
    buy: "CEANNAIGH", dontBuy: "NÁ CEANNAIGH", mixed: "MEASCTHA",
  },
  auth: {
    welcomeBack: "Fáilte ar ais", email: "Ríomhphost", password: "Pasfhocal", signIn: "Logáil isteach",
    create: "Cruthaigh cuntas", or: "nó", google: "Lean ar aghaidh le Google", signUp: "Cláraigh",
  },
  billing: { title: "Ceannaigh tuilleadh scananna", scans: "scananna", buy: "Ceannaigh" },
  success: { successTitle: "D'éirigh leis an íocaíocht", start: "Tosaigh ag anailísiú", buyMore: "Ceannaigh tuilleadh" },
};

const mt: DeepPartial<Dict> = {
  nav: { signOut: "Oħroġ", buyScans: "Ixtri scans" },
  home: { badge: "Analiżi tar-reviżjonijiet bl-IA" },
  analyzer: {
    analyze: "Analizza", analyzing: "Qed janalizza…", unlimited: "Scans bla limitu · amministratur",
    scansLeft: "Scans li fadal: {n}", noScans: "M'hemmx aktar scans", buyMore: "Ixtri aktar",
    errorTitle: "L-analiżi falliet", tryAnother: "Ipprova URL ieħor", buyScans: "Ixtri scans",
  },
  result: {
    product: "Prodott", riskLow: "Baxx", riskMedium: "Medju", riskHigh: "Għoli",
    positive: "pożittivi", neutral: "newtrali", negative: "negattivi",
    summary: "Sommarju", bestFor: "L-aħjar għal", analyzeAnother: "Analizza ieħor",
    buy: "IXTRI", dontBuy: "TIXTRIX", mixed: "IMĦALLAT",
  },
  auth: {
    welcomeBack: "Merħba lura", email: "Email", password: "Password", signIn: "Idħol",
    create: "Oħloq kont", or: "jew", google: "Kompli b'Google", signUp: "Irreġistra",
  },
  billing: { title: "Ixtri aktar scans", scans: "scans", buy: "Ixtri" },
  success: { successTitle: "Il-ħlas irnexxa", start: "Ibda tanalizza", buyMore: "Ixtri aktar" },
};

const zh: DeepPartial<Dict> = {
  nav: { signOut: "退出登录", buyScans: "购买扫描次数" },
  home: {
    badge: "AI 智能评论分析",
    subtitle: "粘贴任意商品链接。我们替你阅读真实的买家评论 —— 并给出明确的结论：值得买 / 不值得买。",
  },
  analyzer: {
    analyze: "分析", analyzing: "分析中…", unlimited: "无限扫描 · 管理员",
    scansLeft: "剩余 {n} 次扫描", noScans: "扫描次数已用完", buyMore: "购买更多",
    loading: "加载页面 → 提取评论 → 运行 AI 分析…", errorTitle: "分析失败",
    tryAnother: "换一个链接", outTitle: "扫描次数已用完",
    outBody: "购买扫描套餐以继续使用 —— 低至 $1.99，永不过期。", buyScans: "购买扫描次数",
    supported: "支持 Amazon、eBay、Walmart、Best Buy、Rozetka、Comfy 以及大多数有公开评论的商品页面。",
  },
  result: {
    product: "商品", confidence: "{n}% 置信度", estRating: "预估评分", reviewsRead: "已读评论",
    fakeRisk: "虚假评论风险", riskLow: "低", riskMedium: "中", riskHigh: "高",
    sentiment: "评论情绪", positive: "好评", neutral: "中立", negative: "差评",
    bottomLine: "结论", love: "用户喜欢的地方", complaints: "常见吐槽", none: "未发现",
    details: "细节分析", bestFor: "适合", watchOut: "需要注意", summary: "概述",
    authenticity: "真实性", analyzeAnother: "分析其他商品", buy: "值得买", dontBuy: "不值得买", mixed: "褒贬不一",
  },
  auth: {
    welcomeBack: "欢迎回来", signInSub: "登录以分析商品评论。", createTitle: "创建账户",
    createSub: "获得 3 次免费评论分析。", name: "姓名（可选）", email: "邮箱", password: "密码",
    confirm: "确认密码", signIn: "登录", create: "创建账户", pleaseWait: "请稍候…", or: "或",
    google: "使用 Google 继续", noAccount: "还没有账户？", signUp: "注册", haveAccount: "已有账户？",
    invalid: "邮箱或密码不正确。", mismatch: "两次输入的密码不一致。", short: "密码至少需要 8 个字符。",
  },
  billing: {
    back: "← 返回分析器", title: "购买更多扫描次数",
    youHave: "你当前有 {n} 次可用扫描。随时充值 —— 购买的扫描次数永不过期。",
    adminUnlimited: "你是管理员 —— 已拥有无限扫描次数。", canceled: "结账已取消 —— 未向你收费。",
    scans: "次扫描", perScan: "每次 {c} 美分", buy: "购买", opening: "正在打开结账…",
    secured: "付款由我们的销售商 Paddle 安全处理。我们的服务器从不存储银行卡信息。",
  },
  success: {
    successTitle: "支付成功", added: "已向你的账户添加 {n} 次扫描。",
    youNow: "你现在有 {n} 次可用扫描。", almost: "马上就好", start: "开始分析", buyMore: "购买更多",
  },
};

const ja: DeepPartial<Dict> = {
  nav: { signOut: "ログアウト", buyScans: "スキャンを購入" },
  home: {
    badge: "AIによるレビュー分析",
    subtitle: "商品のURLを貼り付けてください。本物のカスタマーレビューを代わりに読み、「買い／見送り」を明確に判定します。",
  },
  analyzer: {
    analyze: "分析する", analyzing: "分析中…", unlimited: "無制限スキャン · 管理者",
    scansLeft: "残りスキャン: {n}", noScans: "スキャンがありません", buyMore: "もっと購入",
    loading: "ページを取得 → レビューを抽出 → AI分析中…", errorTitle: "分析に失敗しました",
    tryAnother: "別のURLを試す", outTitle: "スキャンを使い切りました",
    outBody: "続けるにはスキャンパックを購入してください — $1.99から、有効期限なし。", buyScans: "スキャンを購入",
    supported: "Amazon、eBay、Walmart、Best Buy、Rozetka、Comfy など、公開レビューのあるほとんどの商品ページで動作します。",
  },
  result: {
    product: "商品", confidence: "確信度 {n}%", estRating: "推定評価", reviewsRead: "読んだレビュー数",
    fakeRisk: "サクラレビューの危険度", riskLow: "低", riskMedium: "中", riskHigh: "高",
    sentiment: "レビューの傾向", positive: "肯定的", neutral: "中立", negative: "否定的",
    bottomLine: "結論", love: "好評な点", complaints: "よくある不満", none: "見つかりません",
    details: "詳細", bestFor: "おすすめの用途", watchOut: "注意点", summary: "概要",
    authenticity: "信頼性", analyzeAnother: "別の商品を分析", buy: "買い", dontBuy: "見送り", mixed: "賛否両論",
  },
  auth: {
    welcomeBack: "おかえりなさい", signInSub: "ログインしてレビューを分析しましょう。", createTitle: "アカウントを作成",
    createSub: "無料で3回分析できます。", name: "名前（任意）", email: "メールアドレス", password: "パスワード",
    confirm: "パスワードを確認", signIn: "ログイン", create: "アカウント作成", pleaseWait: "お待ちください…", or: "または",
    google: "Googleで続行", noAccount: "アカウントをお持ちでない方", signUp: "新規登録", haveAccount: "すでにアカウントをお持ちの方",
    invalid: "メールアドレスまたはパスワードが正しくありません。", mismatch: "パスワードが一致しません。", short: "パスワードは8文字以上で入力してください。",
  },
  billing: {
    back: "← 分析画面に戻る", title: "スキャンを追加購入",
    youHave: "現在 {n} 回のスキャンが利用可能です。いつでも追加できます — 購入したスキャンは有効期限がありません。",
    adminUnlimited: "あなたは管理者です — すでに無制限のスキャンがあります。", canceled: "決済をキャンセルしました — 請求はされていません。",
    scans: "回", perScan: "1回あたり {c} セント", buy: "購入", opening: "決済を開いています…",
    secured: "決済は当社の販売代理店 Paddle が安全に処理します。カード情報がサーバーに保存されることはありません。",
  },
  success: {
    successTitle: "決済が完了しました", added: "{n} 回のスキャンをアカウントに追加しました。",
    youNow: "現在 {n} 回のスキャンが利用可能です。", almost: "あと少し", start: "分析を始める", buyMore: "もっと購入",
  },
};

const ko: DeepPartial<Dict> = {
  nav: { signOut: "로그아웃", buyScans: "스캔 구매" },
  home: {
    badge: "AI 기반 리뷰 분석",
    subtitle: "어떤 상품의 URL이든 붙여넣으세요. 실제 고객 리뷰를 대신 읽고 '구매 / 비추천'을 명확하게 판정해 드립니다.",
  },
  analyzer: {
    analyze: "분석", analyzing: "분석 중…", unlimited: "무제한 스캔 · 관리자",
    scansLeft: "남은 스캔: {n}", noScans: "스캔이 없습니다", buyMore: "더 구매",
    loading: "페이지 불러오기 → 리뷰 추출 → AI 분석 중…", errorTitle: "분석 실패",
    tryAnother: "다른 URL 시도", outTitle: "스캔을 모두 사용했습니다",
    outBody: "계속하려면 스캔 패키지를 구매하세요 — $1.99부터, 만료되지 않습니다.", buyScans: "스캔 구매",
    supported: "Amazon, eBay, Walmart, Best Buy, Rozetka, Comfy 및 공개 리뷰가 있는 대부분의 상품 페이지에서 작동합니다.",
  },
  result: {
    product: "상품", confidence: "신뢰도 {n}%", estRating: "예상 평점", reviewsRead: "읽은 리뷰",
    fakeRisk: "가짜 리뷰 위험", riskLow: "낮음", riskMedium: "보통", riskHigh: "높음",
    sentiment: "리뷰 분위기", positive: "긍정적", neutral: "중립", negative: "부정적",
    bottomLine: "결론", love: "사람들이 좋아하는 점", complaints: "흔한 불만", none: "발견되지 않음",
    details: "세부 분석", bestFor: "추천 대상", watchOut: "주의할 점", summary: "요약",
    authenticity: "신뢰성", analyzeAnother: "다른 상품 분석", buy: "구매", dontBuy: "비추천", mixed: "찬반 양론",
  },
  auth: {
    welcomeBack: "다시 오신 걸 환영합니다", signInSub: "로그인하여 리뷰를 분석하세요.", createTitle: "계정 만들기",
    createSub: "무료 분석 3회를 받으세요.", name: "이름 (선택)", email: "이메일", password: "비밀번호",
    confirm: "비밀번호 확인", signIn: "로그인", create: "계정 만들기", pleaseWait: "잠시만 기다려 주세요…", or: "또는",
    google: "Google로 계속하기", noAccount: "계정이 없으신가요?", signUp: "회원가입", haveAccount: "이미 계정이 있으신가요?",
    invalid: "이메일 또는 비밀번호가 올바르지 않습니다.", mismatch: "비밀번호가 일치하지 않습니다.", short: "비밀번호는 8자 이상이어야 합니다.",
  },
  billing: {
    back: "← 분석기로 돌아가기", title: "스캔 추가 구매",
    youHave: "현재 {n}회의 스캔을 사용할 수 있습니다. 언제든지 충전하세요 — 구매한 스캔은 만료되지 않습니다.",
    adminUnlimited: "관리자입니다 — 이미 무제한 스캔이 있습니다.", canceled: "결제가 취소되었습니다 — 청구되지 않았습니다.",
    scans: "회", perScan: "회당 {c}센트", buy: "구매", opening: "결제 여는 중…",
    secured: "결제는 당사의 판매처인 Paddle이 안전하게 처리합니다. 카드 정보는 서버에 저장되지 않습니다.",
  },
  success: {
    successTitle: "결제 완료", added: "{n}회의 스캔이 계정에 추가되었습니다.",
    youNow: "이제 {n}회의 스캔을 사용할 수 있습니다.", almost: "거의 다 됐어요", start: "분석 시작", buyMore: "더 구매",
  },
};

const hi: DeepPartial<Dict> = {
  nav: { signOut: "साइन आउट", buyScans: "स्कैन खरीदें" },
  home: {
    badge: "एआई-संचालित समीक्षा विश्लेषण",
    subtitle: "किसी भी प्रोडक्ट का URL पेस्ट करें। हम असली ग्राहक समीक्षाएँ आपके लिए पढ़ते हैं — और साफ़ फैसला देते हैं: खरीदें / न खरीदें।",
  },
  analyzer: {
    analyze: "विश्लेषण करें", analyzing: "विश्लेषण हो रहा है…", unlimited: "असीमित स्कैन · एडमिन",
    scansLeft: "{n} स्कैन शेष", noScans: "कोई स्कैन शेष नहीं", buyMore: "और खरीदें",
    loading: "पेज लोड हो रहा है → समीक्षाएँ निकाली जा रही हैं → एआई विश्लेषण…", errorTitle: "विश्लेषण विफल",
    tryAnother: "दूसरा URL आज़माएँ", outTitle: "आपके स्कैन खत्म हो गए",
    outBody: "जारी रखने के लिए एक स्कैन पैक लें — $1.99 से शुरू, कभी समाप्त नहीं होते।", buyScans: "स्कैन खरीदें",
    supported: "Amazon, eBay, Walmart, Best Buy, Rozetka, Comfy और सार्वजनिक समीक्षाओं वाले अधिकांश प्रोडक्ट पेजों पर काम करता है।",
  },
  result: {
    product: "प्रोडक्ट", confidence: "{n}% भरोसा", estRating: "अनुमानित रेटिंग", reviewsRead: "पढ़ी गई समीक्षाएँ",
    fakeRisk: "नकली समीक्षा जोखिम", riskLow: "कम", riskMedium: "मध्यम", riskHigh: "उच्च",
    sentiment: "समीक्षाओं का रुझान", positive: "सकारात्मक", neutral: "तटस्थ", negative: "नकारात्मक",
    bottomLine: "निष्कर्ष", love: "लोगों को क्या पसंद है", complaints: "आम शिकायतें", none: "कुछ नहीं मिला",
    details: "विस्तार से", bestFor: "के लिए सर्वोत्तम", watchOut: "ध्यान दें", summary: "सारांश",
    authenticity: "प्रामाणिकता", analyzeAnother: "दूसरा विश्लेषण करें", buy: "खरीदें", dontBuy: "न खरीदें", mixed: "मिश्रित",
  },
  auth: {
    welcomeBack: "वापसी पर स्वागत है", signInSub: "समीक्षाओं का विश्लेषण करने के लिए साइन इन करें।", createTitle: "अपना खाता बनाएँ",
    createSub: "3 मुफ़्त विश्लेषण पाएँ।", name: "नाम (वैकल्पिक)", email: "ईमेल", password: "पासवर्ड",
    confirm: "पासवर्ड की पुष्टि करें", signIn: "साइन इन", create: "खाता बनाएँ", pleaseWait: "कृपया प्रतीक्षा करें…", or: "या",
    google: "Google के साथ जारी रखें", noAccount: "खाता नहीं है?", signUp: "साइन अप", haveAccount: "पहले से खाता है?",
    invalid: "अमान्य ईमेल या पासवर्ड।", mismatch: "पासवर्ड मेल नहीं खाते।", short: "पासवर्ड कम से कम 8 अक्षरों का होना चाहिए।",
  },
  billing: {
    back: "← विश्लेषक पर वापस", title: "और स्कैन खरीदें",
    youHave: "आपके पास इस समय {n} स्कैन उपलब्ध हैं। कभी भी टॉप-अप करें — खरीदे गए स्कैन कभी समाप्त नहीं होते।",
    adminUnlimited: "आप एडमिन हैं — आपके पास पहले से असीमित स्कैन हैं।", canceled: "चेकआउट रद्द — आपसे शुल्क नहीं लिया गया।",
    scans: "स्कैन", perScan: "{c}¢ / स्कैन", buy: "खरीदें", opening: "चेकआउट खोल रहे हैं…",
    secured: "भुगतान हमारे विक्रेता Paddle द्वारा सुरक्षित रूप से संसाधित होते हैं। कार्ड कभी हमारे सर्वर पर संग्रहीत नहीं होते।",
  },
  success: {
    successTitle: "भुगतान सफल", added: "आपके खाते में {n} स्कैन जोड़े गए।",
    youNow: "अब आपके पास {n} स्कैन उपलब्ध हैं।", almost: "बस हो ही गया", start: "विश्लेषण शुरू करें", buyMore: "और खरीदें",
  },
};

const id: DeepPartial<Dict> = {
  nav: { signOut: "Keluar", buyScans: "Beli pemindaian" },
  home: {
    badge: "Analisis ulasan bertenaga AI",
    subtitle: "Tempel URL produk apa pun. Kami membaca ulasan pelanggan asli untuk Anda — dan memberi vonis jelas: Beli / Jangan beli.",
  },
  analyzer: {
    analyze: "Analisis", analyzing: "Menganalisis…", unlimited: "Pemindaian tak terbatas · admin",
    scansLeft: "Sisa pemindaian: {n}", noScans: "Pemindaian habis", buyMore: "Beli lagi",
    loading: "Memuat halaman → mengekstrak ulasan → analisis AI…", errorTitle: "Analisis gagal",
    tryAnother: "Coba URL lain", outTitle: "Pemindaian Anda habis",
    outBody: "Dapatkan paket pemindaian untuk lanjut — mulai $1.99 dan tidak pernah kedaluwarsa.", buyScans: "Beli pemindaian",
    supported: "Berfungsi dengan Amazon, eBay, Walmart, Best Buy, Rozetka, Comfy, dan sebagian besar halaman produk dengan ulasan publik.",
  },
  result: {
    product: "Produk", confidence: "{n}% keyakinan", estRating: "Perkiraan rating", reviewsRead: "Ulasan dibaca",
    fakeRisk: "Risiko ulasan palsu", riskLow: "Rendah", riskMedium: "Sedang", riskHigh: "Tinggi",
    sentiment: "Sentimen ulasan", positive: "positif", neutral: "netral", negative: "negatif",
    bottomLine: "Kesimpulan", love: "Yang disukai orang", complaints: "Keluhan umum", none: "Tidak ditemukan",
    details: "Secara rinci", bestFor: "Terbaik untuk", watchOut: "Waspadai", summary: "Ringkasan",
    authenticity: "Keaslian", analyzeAnother: "Analisis lainnya", buy: "BELI", dontBuy: "JANGAN BELI", mixed: "CAMPURAN",
  },
  auth: {
    welcomeBack: "Selamat datang kembali", signInSub: "Masuk untuk menganalisis ulasan.", createTitle: "Buat akun Anda",
    createSub: "Dapatkan 3 analisis gratis.", name: "Nama (opsional)", email: "Email", password: "Kata sandi",
    confirm: "Konfirmasi kata sandi", signIn: "Masuk", create: "Buat akun", pleaseWait: "Mohon tunggu…", or: "atau",
    google: "Lanjutkan dengan Google", noAccount: "Belum punya akun?", signUp: "Daftar", haveAccount: "Sudah punya akun?",
    invalid: "Email atau kata sandi tidak valid.", mismatch: "Kata sandi tidak cocok.", short: "Kata sandi harus minimal 8 karakter.",
  },
  billing: {
    back: "← Kembali ke penganalisis", title: "Beli lebih banyak pemindaian",
    youHave: "Anda saat ini memiliki {n} pemindaian tersedia. Isi ulang kapan saja — pemindaian yang dibeli tidak kedaluwarsa.",
    adminUnlimited: "Anda admin — Anda sudah punya pemindaian tak terbatas.", canceled: "Checkout dibatalkan — Anda tidak ditagih.",
    scans: "pemindaian", perScan: "{c}¢ / pemindaian", buy: "Beli", opening: "Membuka pembayaran…",
    secured: "Pembayaran diproses dengan aman oleh Paddle, reseller kami. Kartu tidak pernah disimpan di server kami.",
  },
  success: {
    successTitle: "Pembayaran berhasil", added: "{n} pemindaian ditambahkan ke akun Anda.",
    youNow: "Anda kini memiliki {n} pemindaian tersedia.", almost: "Hampir selesai", start: "Mulai menganalisis", buyMore: "Beli lagi",
  },
};

const vi: DeepPartial<Dict> = {
  nav: { signOut: "Đăng xuất", buyScans: "Mua lượt quét" },
  home: {
    badge: "Phân tích đánh giá bằng AI",
    subtitle: "Dán URL của bất kỳ sản phẩm nào. Chúng tôi đọc các đánh giá thật của khách hàng thay bạn — và đưa ra kết luận rõ ràng: Nên mua / Không nên mua.",
  },
  analyzer: {
    analyze: "Phân tích", analyzing: "Đang phân tích…", unlimited: "Lượt quét không giới hạn · quản trị",
    scansLeft: "Còn lại {n} lượt quét", noScans: "Hết lượt quét", buyMore: "Mua thêm",
    loading: "Đang tải trang → trích xuất đánh giá → phân tích AI…", errorTitle: "Phân tích thất bại",
    tryAnother: "Thử URL khác", outTitle: "Bạn đã hết lượt quét",
    outBody: "Mua gói lượt quét để tiếp tục — từ $1.99 và không bao giờ hết hạn.", buyScans: "Mua lượt quét",
    supported: "Hoạt động với Amazon, eBay, Walmart, Best Buy, Rozetka, Comfy và hầu hết các trang sản phẩm có đánh giá công khai.",
  },
  result: {
    product: "Sản phẩm", confidence: "{n}% độ tin cậy", estRating: "Đánh giá ước tính", reviewsRead: "Số đánh giá đã đọc",
    fakeRisk: "Nguy cơ đánh giá giả", riskLow: "Thấp", riskMedium: "Trung bình", riskHigh: "Cao",
    sentiment: "Tâm lý đánh giá", positive: "tích cực", neutral: "trung lập", negative: "tiêu cực",
    bottomLine: "Kết luận", love: "Điều mọi người thích", complaints: "Phàn nàn thường gặp", none: "Không tìm thấy",
    details: "Chi tiết", bestFor: "Phù hợp nhất cho", watchOut: "Cần lưu ý", summary: "Tóm tắt",
    authenticity: "Tính xác thực", analyzeAnother: "Phân tích sản phẩm khác", buy: "NÊN MUA", dontBuy: "KHÔNG NÊN MUA", mixed: "TRÁI CHIỀU",
  },
  auth: {
    welcomeBack: "Chào mừng trở lại", signInSub: "Đăng nhập để phân tích đánh giá.", createTitle: "Tạo tài khoản",
    createSub: "Nhận 3 lượt phân tích miễn phí.", name: "Tên (tùy chọn)", email: "Email", password: "Mật khẩu",
    confirm: "Xác nhận mật khẩu", signIn: "Đăng nhập", create: "Tạo tài khoản", pleaseWait: "Vui lòng đợi…", or: "hoặc",
    google: "Tiếp tục với Google", noAccount: "Chưa có tài khoản?", signUp: "Đăng ký", haveAccount: "Đã có tài khoản?",
    invalid: "Email hoặc mật khẩu không hợp lệ.", mismatch: "Mật khẩu không khớp.", short: "Mật khẩu phải có ít nhất 8 ký tự.",
  },
  billing: {
    back: "← Quay lại trình phân tích", title: "Mua thêm lượt quét",
    youHave: "Bạn hiện có {n} lượt quét khả dụng. Nạp thêm bất cứ lúc nào — lượt quét đã mua không bao giờ hết hạn.",
    adminUnlimited: "Bạn là quản trị viên — bạn đã có lượt quét không giới hạn.", canceled: "Đã hủy thanh toán — bạn chưa bị tính phí.",
    scans: "lượt quét", perScan: "{c}¢ / lượt", buy: "Mua", opening: "Đang mở thanh toán…",
    secured: "Thanh toán được xử lý an toàn bởi Paddle, đại lý của chúng tôi. Thẻ không bao giờ được lưu trên máy chủ của chúng tôi.",
  },
  success: {
    successTitle: "Thanh toán thành công", added: "Đã thêm {n} lượt quét vào tài khoản của bạn.",
    youNow: "Bây giờ bạn có {n} lượt quét khả dụng.", almost: "Sắp xong", start: "Bắt đầu phân tích", buyMore: "Mua thêm",
  },
};

export const translations: Partial<Record<Locale, DeepPartial<Dict>>> = {
  ru, uk, de, fr, es, it, pt, nl, pl, sv, da, fi, cs, sk, ro, el, hu, bg, hr, sl,
  et, lv, lt, ga, mt, zh, ja, ko, hi, id, vi,
};
