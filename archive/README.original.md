# LA PERSONALIDAD SINTÉTICA: EVALUACIÓN PSICOLÓGICA EN MODELOS DE INTELIGENCIA ARTIFICIAL

## DESCRIPCIÓN

Este trabajo se basa en corpus de literatura sobre 150 estudios científicos publicados de 2022 a 2025 (rango de estudio) que centra su línea de investigación central sobre la personalidad sintética. El corpus aborda tres cuestiones principales para abordar el estudio: (1) la aplicabilidad de tests psicométricos diseñados para humanos, (2) la validez de constructo de "personalidad" en sistemas no conscientes, y (3) las implicaciones metodológicas para IA y psicología.

Los últimos trabajos de investigación muestran algunos hallazgos bastante contradictorios. Mientras que algunos estudios nos indican que modelos como GPT-4 simulan el Big Five con considerable validez alta, otros trabajos más críticos demuestran que estos mismos instrumentos fallan en las pruebas de fiabilidad básicas. Esta divergencia revela profundas divisiones conceptuales sobre lo que la "personalidad" realmente significa fuera del contexto humano.

## CONTENIDO

El documento principal del repositorio en el que se encuentran listados los 150 artículos a analizar, que es de mi autoría, se encuentra de manera pública en GitHub recoge todos los artículos analizados, organizados individualmente.

En el archivo de resumen [`state-of-the-art-synthetic-personality-llms.md`](state-of-the-art-synthetic-personality-llms.md), nos encontraremos las siguientes secciones:

- **Título original**.
- **Categoría** (Evaluación y validación psicométrica | Inducción y control de personalidad | Aplicaciones, sesgos y consecuencias sociales).
- **Año de publicación**.
- **Idioma**.
- **Autores** (lista completa).
- **Keywords** (términos principales del artículo).
- **URL** (enlace directo al artículo completo).
- **Abstract (English)** (resumen original completo).
- **Resumen (Español)** (traducción académica en castellano neutro).

## ÁREAS TEMÁTICAS PARA LA INVESTIGACIÓN

## METODOLOGÍA

La búsqueda se realizó siguiendo metodología PRISMA en bases académicas y repositorios especializados: ArXiv, ACL Anthology, conferencias top (NeurIPS, EMNLP, ACL, NAACL, EACL, COLING), revistas como Nature y PNAS Nexus, además de PubMed Central y ResearchGate.

La elección es elegir las mejores investigaciones centradas en pruebas prácticas, medición, y averiguar los rasgos de personalidad en LLMs o si es un aspecto que no implica correlación con las pruebas psicométricas de evaluación de la personalidad humanas.

**Cadenas de búsqueda (queries PRISMA):**

```
# Query principal (evaluación psicométrica)
("large language model*" OR "LLM*" OR "language model*" OR "GPT" OR "BERT" OR "transformer*")
AND ("personality" OR "personality trait*" OR "Big Five" OR "OCEAN" OR "MBTI" OR "Myers-Briggs" OR "HEXACO" OR "Dark Triad")
AND ("assessment" OR "evaluation" OR "measurement" OR "psychometric*" OR "test*" OR "inventory")

# Query secundaria (inducción y control)
("large language model*" OR "LLM*" OR "GPT" OR "Claude" OR "Gemini")
AND ("personality" OR "persona" OR "character" OR "trait*")
AND ("prompt*" OR "fine-tun*" OR "steer*" OR "induc*" OR "control" OR "simulat*" OR "generat*")

# Query terciaria (aplicaciones y sesgos)
("large language model*" OR "LLM*" OR "ChatGPT" OR "conversational AI")
AND ("personality" OR "Big Five" OR "MBTI")
AND ("bias" OR "fairness" OR "stereotype*" OR "application*" OR "chatbot*" OR "agent*" OR "social" OR "cultural")

# Query cuaternaria (modelos de razonamiento 2024-2025)
("o1" OR "o3-mini" OR "reasoning model*" OR "chain-of-thought")
AND ("personality" OR "psychometric*" OR "trait*")

# Query quinaria (aspectos multimodales)
("vision-language model*" OR "VLM*" OR "multimodal" OR "GPT-4V")
AND ("personality" OR "emotion*" OR "affect*" OR "Big Five")
```

**Criterios de inclusión:**
- Trabajos empíricos sobre evaluación, medición, inducción o manifestación de rasgos de personalidad en LLMs.
- Estudios publicados entre 2022-2025.
- Acceso al texto completo (PDF o preprint).
- Validación experimental o análisis cuantitativo.

**Criterios de exclusión:**
- Estudios puramente teóricos sin validación experimental.
- Artículos que mencionan personalidad de forma tangencial.
- Trabajos sin acceso al documento completo.
- Duplicados y versiones preliminares cuando existe versión final.

## MÉTRICAS

El corpus usado o repositorio de artículos se compone de 150 artículos publicados entre 2022 y 2025, todos en inglés y con acceso al texto completo del mismo. La distribución temporal muestra un crecimiento significativo: 8 artículos en 2022, 15 en 2023, un salto a 67 en 2024, y 60 ya en 2025 (hasta la fecha de corte (septiembre 2025). Este patrón refleja el interés en el concepto de personalidad sintética tras el lanzamiento de ChatGPT y modelos de razonamiento avanzados como GPT-4o, Claude 3.5, o1 o Gemini.

## DISTRIBUCIÓN TEMPORAL

| Año | Artículos | % del total | Crecimiento | Evaluación psicométrica | Inducción y control | Aplicaciones y sesgos |
|-----|-----------|-------------|-------------|------------------------|--------------------|-----------------------|
| 2022 | 8 | 5.3% | — | 4 (50.0%) | 1 (12.5%) | 3 (37.5%) |
| 2023 | 15 | 10.0% | +87.5% | 5 (33.3%) | 3 (20.0%) | 7 (46.7%) |
| 2024 | 67 | 44.7% | +346.7% | 26 (38.8%) | 20 (29.9%) | 21 (31.3%) |
| 2025 | 60 | 40.0% | -10.4% | 15 (25.0%) | 21 (35.0%) | 24 (40.0%) |
| **Total** | **150** | **100%** | — | **50** | **45** | **55** |

**Tendencias detectadas:**
- **2022-2023:** Fase inicial de la investigación (23 artículos, 15,3%).
- **2024:** Aumento de los estudios (67 artículos, 44,7%) tras la liberación de GPT-4, Claude 3, y otros modelos instruccionales avanzados.
- **2025:** Consolidación (60 artículos hasta septiembre de 2025) poniéndo con énfasis en modelos de razonamiento (o1, o3-mini, Claude 3.5 Sonnet/Opus o Gemini 2.0).
- **Dominancia temática:** la evaluación psicométrica es la que lidera en 2024 (38.8%), mientras que aplicaciones y sesgos domina en 2025 (40.0%), reflejando madurez del campo hacia implementaciones prácticas y preocupaciones éticas y aplicación de marcos legales existentes.

## CATEGORIZACIÓN DE LA INVESTIGACIÓN

Los 150 artículos han sido clasificados en 3 categorías principales según su enfoque metodológico y aportación científica. En nuestra taxonomía de categorización adoptada se reflejan las tres líneas de investigación que se podrán utilizar dentro del campo de la personalidad sintética.

<a id="eval-validacion"></a>
### Evaluación y validación psicométrica

**Artículos a estudiar:** 50 (33.3% del corpus total).

| # | Título | Año | Enlace |
|---|--------|-----|--------|
| 1 | Personality Traits in Large Language Models | 2023 | [Ver →](state-of-the-art-synthetic-personality-llms.md#artículo-1) |
| 2 | PersonaLLM: Investigating the Ability of LLMs to Express Personality Traits | 2024 | [Ver →](state-of-the-art-synthetic-personality-llms.md#artículo-2) |
| 3 | LLMs Simulate Big Five Personality Traits: Further Evidence | 2024 | [Ver →](state-of-the-art-synthetic-personality-llms.md#artículo-3) |
| 8 | On the Reliability of Psychological Scales on Large Language Models | 2024 | [Ver →](state-of-the-art-synthetic-personality-llms.md#artículo-8) |
| 10 | Who is GPT-3? An Exploration of Personality, Values and Demographics | 2022 | [Ver →](state-of-the-art-synthetic-personality-llms.md#artículo-10) |
| 11 | Systematic Assessment of GPT-3 for Zero-Shot Personality Estimation | 2023 | [Ver →](state-of-the-art-synthetic-personality-llms.md#artículo-11) |
| 12 | AI Psychometrics: Assessing the Psychological Profiles of LLMs | 2024 | [Ver →](state-of-the-art-synthetic-personality-llms.md#artículo-12) |
| 13 | AI Psychometrics: Assessing the Psychological Profiles of LLMs | 2024 | [Ver →](state-of-the-art-synthetic-personality-llms.md#artículo-13) |
| 14 | Do LLMs Have Distinct and Consistent Personality? TRAIT | 2024 | [Ver →](state-of-the-art-synthetic-personality-llms.md#artículo-14) |
| 15 | Evaluating the Alignment of LLMs on Personality Inference | 2025 | [Ver →](state-of-the-art-synthetic-personality-llms.md#artículo-15) |
| 16 | Evaluating the Capability of LLMs in Emulating Personality | 2024 | [Ver →](state-of-the-art-synthetic-personality-llms.md#artículo-16) |
| 17 | CAPE: Context-Aware Personality Evaluation Framework | 2025 | [Ver →](state-of-the-art-synthetic-personality-llms.md#artículo-17) |
| 20 | Framework for Early Phases of Personality Test Development | 2025 | [Ver →](state-of-the-art-synthetic-personality-llms.md#artículo-20) |
| 24 | Do LLMs Possess a Personality? MBTI Test Evaluation | 2023 | [Ver →](state-of-the-art-synthetic-personality-llms.md#artículo-24) |
| 25 | Do LLMs Possess a Personality? MBTI Test Evaluation | 2023 | [Ver →](state-of-the-art-synthetic-personality-llms.md#artículo-25) |
| 26 | Can ChatGPT Assess Human Personalities? Evaluation Framework | 2023 | [Ver →](state-of-the-art-synthetic-personality-llms.md#artículo-26) |
| 28 | Identifying Multiple Personalities with External Evaluation | 2024 | [Ver →](state-of-the-art-synthetic-personality-llms.md#artículo-28) |
| 31 | Personality Testing: Limited Temporal Stability | 2024 | [Ver →](state-of-the-art-synthetic-personality-llms.md#artículo-31) |
| 32 | Personality Testing: Limited Temporal Stability | 2024 | [Ver →](state-of-the-art-synthetic-personality-llms.md#artículo-32) |
| 33 | Personality Testing: Limited Temporal Stability | 2024 | [Ver →](state-of-the-art-synthetic-personality-llms.md#artículo-33) |
| 34 | Applying Psychometrics to Simulated Populations: HEXACO | 2025 | [Ver →](state-of-the-art-synthetic-personality-llms.md#artículo-34) |
| 38 | Questioning the Validity of Personality Tests for LLMs | 2023 | [Ver →](state-of-the-art-synthetic-personality-llms.md#artículo-38) |
| 42 | Quantifying AI Psychology: Psychometric Benchmark | 2024 | [Ver →](state-of-the-art-synthetic-personality-llms.md#artículo-42) |
| 43 | Beyond Self-Reports: Multi-Observer Agents | 2025 | [Ver →](state-of-the-art-synthetic-personality-llms.md#artículo-43) |
| 44 | Psychometric Evaluation of LLM Embeddings | 2025 | [Ver →](state-of-the-art-synthetic-personality-llms.md#artículo-44) |
| 45 | LMLPA: Language Model Linguistic Personality Assessment | 2024 | [Ver →](state-of-the-art-synthetic-personality-llms.md#artículo-45) |
| 46 | LMLPA: Language Model Linguistic Personality Assessment | 2024 | [Ver →](state-of-the-art-synthetic-personality-llms.md#artículo-46) |
| 47 | You Don't Need a Personality Test to Know Models Are Unreliable | 2024 | [Ver →](state-of-the-art-synthetic-personality-llms.md#artículo-47) |
| 48 | Self-Reports are Unreliable Measures of LLM Personality | 2024 | [Ver →](state-of-the-art-synthetic-personality-llms.md#artículo-48) |
| 49 | Is Machine Psychology Here? Requirements for Using Tests on LLMs | 2025 | [Ver →](state-of-the-art-synthetic-personality-llms.md#artículo-49) |
| 50 | Persistent Instability in LLM Personality Measurements | 2025 | [Ver →](state-of-the-art-synthetic-personality-llms.md#artículo-50) |
| 51 | Stick to Your Role: Stability of Personal Values in LLMs | 2025 | [Ver →](state-of-the-art-synthetic-personality-llms.md#artículo-51) |
| 53 | The Illusion of Personality: Dissociation in LLMs | 2025 | [Ver →](state-of-the-art-synthetic-personality-llms.md#artículo-53) |
| 77 | LLMs Demonstrate Distinctive Personality Profiles | 2024 | [Ver →](state-of-the-art-synthetic-personality-llms.md#artículo-77) |
| 79 | Do LLMs Have a Personality? Psychometric Assessment | 2025 | [Ver →](state-of-the-art-synthetic-personality-llms.md#artículo-79) |
| 80 | Developing Personality Inventories Using Generative AI | 2025 | [Ver →](state-of-the-art-synthetic-personality-llms.md#artículo-80) |
| 81 | Exploring Impact of Language Switching on Personality | 2025 | [Ver →](state-of-the-art-synthetic-personality-llms.md#artículo-81) |
| 89 | Rediscovering Latent Dimensions of Personality with LLMs | 2024 | [Ver →](state-of-the-art-synthetic-personality-llms.md#artículo-89) |
| 112 | Can ChatGPT Assess Human Personalities? Framework | 2023 | [Ver →](state-of-the-art-synthetic-personality-llms.md#artículo-112) |
| 116 | Who is GPT-3? Exploration of Personality and Values | 2022 | [Ver →](state-of-the-art-synthetic-personality-llms.md#artículo-116) |
| 118 | Estimating Personality of White-Box Language Models | 2022 | [Ver →](state-of-the-art-synthetic-personality-llms.md#artículo-118) |
| 120 | Deterministic AI Agent Personality Expression through Standard Psychological Diagnostics | 2025 | [Ver →](state-of-the-art-synthetic-personality-llms.md#article-120) |
| 121 | Value-Spectrum: Quantifying Preferences of Vision-Language Models | 2025 | [Ver →](state-of-the-art-synthetic-personality-llms.md#article-121) |
| 125 | Cognitive Alignment in Personality Reasoning: Leveraging Prototype Theory for MBTI | 2024 | [Ver →](state-of-the-art-synthetic-personality-llms.md#article-125) |
| 126 | Traits Run Deep: Enhancing Personality Assessment via Psychology-Guided LLM Representations | 2025 | [Ver →](state-of-the-art-synthetic-personality-llms.md#article-126) |
| 127 | From Post To Personality: Harnessing LLMs for MBTI Prediction in Social Media | 2025 | [Ver →](state-of-the-art-synthetic-personality-llms.md#article-127) |
| 137 | LLM-GLOBE: A Benchmark for Evaluating Large Language Models on Culture-Specific Values | 2024 | [Ver →](state-of-the-art-synthetic-personality-llms.md#article-137) |
| 143 | CounselBench: A Benchmark for Evaluating Empathy and Personality Consistency in Mental Health Counseling | 2025 | [Ver →](state-of-the-art-synthetic-personality-llms.md#article-143) |
| 150 | Emotion Recognition in Conversation via Dynamic Personality Representation Learning | 2024 | [Ver →](state-of-the-art-synthetic-personality-llms.md#article-150) |

En esta categoría medimos la fiabilidad, validez y consistencia de inventarios psicométricos (Big Five, MBTI, HEXACO, Dark Triad) utilizados cuando se aplican a LLMs. Se evalúa si los instrumentos diseñados para humanos capturan constructos psicológicos genuinos en sistemas artificiales o simplemente reflejan patrones estadísticos.

En esta categoría la hipótesis se basa en que las pruebas psicométricas estandarizadas pueden o no pueden medir constructos de personalidad válidos en modelos de lenguaje. La literatura evidencia disonancia entre dos posiciones: (1) los modelos exhiben rasgos de personalidad medibles con instrumentos tradicionales, demostrando validez convergente con muestras humanas; (2) los tests fallan criterios básicos de fiabilidad (sensibilidad al orden de opciones, inconsistencia en ítems inversos, disociación entre autoreporte y comportamiento), cuestionando la validez de constructo de "personalidad" en sistemas no conscientes.

---

<a id="induccion-control"></a>
### Inducción y control de personalidad

**Artículos a estudiar:** 45 (30,0% del corpus total).

| # | Título | Año | Enlace |
|---|--------|-----|--------|
| 4 | Evaluating and Inducing Personality in Pre-trained Language Models | 2023 | [Ver →](state-of-the-art-synthetic-personality-llms.md#artículo-4) |
| 5 | Evaluating and Inducing Personality in Pre-trained Language Models | 2023 | [Ver →](state-of-the-art-synthetic-personality-llms.md#artículo-5) |
| 6 | BIG5-CHAT: Shaping LLM Personalities Through Training | 2024 | [Ver →](state-of-the-art-synthetic-personality-llms.md#artículo-6) |
| 7 | BIG5-CHAT: Shaping LLM Personalities Through Training | 2024 | [Ver →](state-of-the-art-synthetic-personality-llms.md#artículo-7) |
| 9 | Manipulating the Perceived Personality Traits of LLMs | 2023 | [Ver →](state-of-the-art-synthetic-personality-llms.md#artículo-9) |
| 18 | Scaling Personality Control with Big Five Scaling Prompts | 2025 | [Ver →](state-of-the-art-synthetic-personality-llms.md#artículo-18) |
| 22 | Personality as Probe for LLM Evaluation: Method Tradeoffs | 2025 | [Ver →](state-of-the-art-synthetic-personality-llms.md#artículo-22) |
| 23 | Exploring Potential of LLMs for Simulating Personality | 2025 | [Ver →](state-of-the-art-synthetic-personality-llms.md#artículo-23) |
| 27 | Machine Mindset: An MBTI Exploration of LLMs | 2023 | [Ver →](state-of-the-art-synthetic-personality-llms.md#artículo-27) |
| 36 | SAC: Framework for Measuring and Inducing Personality Traits | 2025 | [Ver →](state-of-the-art-synthetic-personality-llms.md#artículo-36) |
| 39 | Two Tales of Persona in LLMs: Survey of Role-Playing | 2024 | [Ver →](state-of-the-art-synthetic-personality-llms.md#artículo-39) |
| 52 | Scaling Law in LLM Simulated Personality | 2024 | [Ver →](state-of-the-art-synthetic-personality-llms.md#artículo-52) |
| 54 | LLMs Show Human-Like Social Desirability Biases | 2024 | [Ver →](state-of-the-art-synthetic-personality-llms.md#artículo-54) |
| 60 | Exploring Personality Traits Through Latent Feature Steering | 2024 | [Ver →](state-of-the-art-synthetic-personality-llms.md#artículo-60) |
| 69 | Identifying and Manipulating Personality Traits | 2024 | [Ver →](state-of-the-art-synthetic-personality-llms.md#artículo-69) |
| 71 | Can LLMs Generate Behaviors for Embodied Virtual Agents? | 2025 | [Ver →](state-of-the-art-synthetic-personality-llms.md#artículo-71) |
| 72 | Personality-Driven Decision-Making in LLM-Based Agents | 2025 | [Ver →](state-of-the-art-synthetic-personality-llms.md#artículo-72) |
| 73 | LLM Agents in Interaction: Measuring Personality Consistency | 2024 | [Ver →](state-of-the-art-synthetic-personality-llms.md#artículo-73) |
| 76 | Humanizing LLMs: Survey of Psychological Measurements | 2025 | [Ver →](state-of-the-art-synthetic-personality-llms.md#artículo-76) |
| 82 | Personality Vector: Modulating Personality by Model Merging | 2025 | [Ver →](state-of-the-art-synthetic-personality-llms.md#artículo-82) |
| 83 | Humanoid Artificial Consciousness with LLM | 2025 | [Ver →](state-of-the-art-synthetic-personality-llms.md#artículo-83) |
| 84 | Traits Run Deep: Enhancing Personality Assessment | 2025 | [Ver →](state-of-the-art-synthetic-personality-llms.md#artículo-84) |
| 86 | Population-Aligned Persona Generation for Social Simulation | 2025 | [Ver →](state-of-the-art-synthetic-personality-llms.md#artículo-86) |
| 88 | Exploring Potential of LLMs to Simulate Personality | 2025 | [Ver →](state-of-the-art-synthetic-personality-llms.md#artículo-88) |
| 90 | PICLe: Eliciting Diverse Behaviors from LLMs | 2024 | [Ver →](state-of-the-art-synthetic-personality-llms.md#artículo-90) |
| 91 | LLMs as Superpositions of Cultural Perspectives | 2024 | [Ver →](state-of-the-art-synthetic-personality-llms.md#artículo-91) |
| 93 | Evaluating Efficacy of LLMs to Emulate Realistic Personalities | 2024 | [Ver →](state-of-the-art-synthetic-personality-llms.md#artículo-93) |
| 94 | InCharacter: Evaluating Personality Fidelity in Role-Playing | 2024 | [Ver →](state-of-the-art-synthetic-personality-llms.md#artículo-94) |
| 95 | PsychoGAT: Novel Psychological Measurement Paradigm | 2024 | [Ver →](state-of-the-art-synthetic-personality-llms.md#artículo-95) |
| 96 | Investigating Personality Consistency in Quantized Agents | 2024 | [Ver →](state-of-the-art-synthetic-personality-llms.md#artículo-96) |
| 98 | PersonaLLM: Investigating Ability of LLMs to Express Traits | 2024 | [Ver →](state-of-the-art-synthetic-personality-llms.md#artículo-98) |
| 99 | PSYDIAL: Personality-based Synthetic Dialogue Generation | 2024 | [Ver →](state-of-the-art-synthetic-personality-llms.md#artículo-99) |
| 100 | Big-Five Backstage: Dataset for Characters Personality Traits | 2024 | [Ver →](state-of-the-art-synthetic-personality-llms.md#artículo-100) |
| 101 | Is Persona Enough for Personality? Reconstructing Latent Traits | 2025 | [Ver →](state-of-the-art-synthetic-personality-llms.md#artículo-101) |
| 102 | Survey of Personality, Persona, and Profile in Agents | 2024 | [Ver →](state-of-the-art-synthetic-personality-llms.md#artículo-102) |
| 103 | Character-LLM: A Trainable Agent for Role-Playing | 2024 | [Ver →](state-of-the-art-synthetic-personality-llms.md#artículo-103) |
| 104 | From Persona to Personalization: Survey on Role-Playing Agents | 2024 | [Ver →](state-of-the-art-synthetic-personality-llms.md#artículo-104) |
| 115 | Evaluating and Inducing Personality (Early Version) | 2022 | [Ver →](state-of-the-art-synthetic-personality-llms.md#artículo-115) |
| 117 | Identifying and Manipulating Personality Traits (Early Version) | 2022 | [Ver →](state-of-the-art-synthetic-personality-llms.md#artículo-117) |
| 122 | The Power of Personality: A Human Simulation Perspective to Investigate Large Language Model Agents | 2025 | [Ver →](state-of-the-art-synthetic-personality-llms.md#article-122) |
| 124 | Psychologically Enhanced AI Agents (MBTI-in-Thoughts) | 2025 | [Ver →](state-of-the-art-synthetic-personality-llms.md#article-124) |
| 128 | Exploring the Personality Traits of LLMs through Latent Features Steering | 2024 | [Ver →](state-of-the-art-synthetic-personality-llms.md#article-128) |
| 129 | Personality-Driven Decision-Making in Autonomous Agents | 2025 | [Ver →](state-of-the-art-synthetic-personality-llms.md#article-129) |
| 130 | A-MEM: Agentic Memory for LLM Agents | 2025 | [Ver →](state-of-the-art-synthetic-personality-llms.md#article-130) |
| 140 | MM-RLHF: Multimodal Personality Alignment for Vision-Language Models | 2025 | [Ver →](state-of-the-art-synthetic-personality-llms.md#article-140) |

En esta categoría se estudian técnicas para inducir, moldear y controlar rasgos específicos de personalidad en los LLMs a través de intervención técnica: ingeniería de instrucciones (prompting), ajuste fino supervisado (fine-tuning), optimización directa de preferencias (DPO), dirección mecanicista (steering), y fusión de modelos (model merging).

La hipótesis que se trabaja es si se puede ajustar los rasgos de personalidad de un modelo de lenguaje de una manera constante y controlada ajustando sus pesos, activaciones o contexto de entrada, tienden a crear caracteres o personalidades más consistentes y creíbles. Puede o no existir un trade-off fundamental entre personalidad y preservación de capacidades downstream.

---

<a id="aplicaciones-sesgos"></a>
### Aplicaciones, sesgos y consecuencias sociales

**Artículos a estudiar:** 55 (36,7% del corpus total).

| # | Título | Año | Enlace |
|---|--------|-----|--------|
| 19 | Predicting Big Five Personality Traits in Chinese Counselling Dialogues | 2024 | [Ver →](state-of-the-art-synthetic-personality-llms.md#artículo-19) |
| 21 | On the Emergent Capabilities of ChatGPT 4 to Estimate Personality Traits | 2025 | [Ver →](state-of-the-art-synthetic-personality-llms.md#artículo-21) |
| 29 | Can Large Language Models Understand You Better? An MBTI Detection Dataset | 2024 | [Ver →](state-of-the-art-synthetic-personality-llms.md#artículo-29) |
| 30 | Evaluating the Psychological Safety of Large Language Models | 2022 | [Ver →](state-of-the-art-synthetic-personality-llms.md#artículo-30) |
| 35 | Exploring the Impact of Personality Traits on LLM Bias and Toxicity | 2025 | [Ver →](state-of-the-art-synthetic-personality-llms.md#artículo-35) |
| 37 | Moral Foundations of Large Language Models | 2023 | [Ver →](state-of-the-art-synthetic-personality-llms.md#artículo-37) |
| 41 | Psychometrics of Large Language Models: A Systematic Review | 2025 | [Ver →](state-of-the-art-synthetic-personality-llms.md#artículo-41) |
| 55 | Can AI Understand Human Personality? Comparing Humans and AI Systems | 2024 | [Ver →](state-of-the-art-synthetic-personality-llms.md#artículo-55) |
| 56 | Marked Personas: Using Natural Language Prompts to Measure Stereotypes | 2023 | [Ver →](state-of-the-art-synthetic-personality-llms.md#artículo-56) |
| 57 | Theory-Grounded Measurement of U.S. Social Stereotypes in Language Models | 2022 | [Ver →](state-of-the-art-synthetic-personality-llms.md#artículo-57) |
| 58 | Uncovering Stereotypes in Large Language Models: Task Complexity Approach | 2024 | [Ver →](state-of-the-art-synthetic-personality-llms.md#artículo-58) |
| 59 | Inclusivity in Large Language Models: Personality Traits and Gender Bias | 2024 | [Ver →](state-of-the-art-synthetic-personality-llms.md#artículo-59) |
| 61 | Impact of LLM Personality on Cognitive Biases in Decision-Making Tasks | 2025 | [Ver →](state-of-the-art-synthetic-personality-llms.md#artículo-61) |
| 62 | LLMs Portray Socially Subordinate Groups as More Homogeneous | 2024 | [Ver →](state-of-the-art-synthetic-personality-llms.md#artículo-62) |
| 63 | Performance and Biases of Large Language Models in Simulating Public Opinion | 2024 | [Ver →](state-of-the-art-synthetic-personality-llms.md#artículo-63) |
| 64 | Measuring Gender and Racial Biases in LLMs: Intersectional Evidence | 2025 | [Ver →](state-of-the-art-synthetic-personality-llms.md#artículo-64) |
| 65 | Large Language Models Can Infer Psychological Dispositions of Social Media Users | 2024 | [Ver →](state-of-the-art-synthetic-personality-llms.md#artículo-65) |
| 66 | How Do Personality Traits Influence Negotiation Outcomes? A Simulation | 2024 | [Ver →](state-of-the-art-synthetic-personality-llms.md#artículo-66) |
| 67 | Unveiling Personality Traits: A New Benchmark Dataset for Explainable Recognition | 2024 | [Ver →](state-of-the-art-synthetic-personality-llms.md#artículo-67) |
| 68 | Bias and Fairness in Large Language Models: A Survey | 2024 | [Ver →](state-of-the-art-synthetic-personality-llms.md#artículo-68) |
| 70 | PUB: A Personality-Enhanced LLM-Driven User Behavior Simulator | 2025 | [Ver →](state-of-the-art-synthetic-personality-llms.md#artículo-70) |
| 74 | Automated LLM Questionnaire for Automatic Psychiatric Assessment | 2024 | [Ver →](state-of-the-art-synthetic-personality-llms.md#artículo-74) |
| 75 | Psychometric Shaping of Personality Modulates Capabilities and Safety | 2025 | [Ver →](state-of-the-art-synthetic-personality-llms.md#artículo-75) |
| 78 | Attitudes Toward AI: Measurement and Associations with Personality | 2024 | [Ver →](state-of-the-art-synthetic-personality-llms.md#artículo-78) |
| 85 | PerFairX: Is There a Balance Between Fairness and Personality in LLM? | 2025 | [Ver →](state-of-the-art-synthetic-personality-llms.md#artículo-85) |
| 87 | The Power of Personality: A Human Simulation Perspective to Investigate LLM Agents | 2025 | [Ver →](state-of-the-art-synthetic-personality-llms.md#artículo-87) |
| 92 | LLM vs Small Model? LLM-Based Text Augmentation for Personality Detection | 2024 | [Ver →](state-of-the-art-synthetic-personality-llms.md#artículo-92) |
| 97 | Personality-aware Student Simulation for Conversational Intelligent Tutoring Systems | 2024 | [Ver →](state-of-the-art-synthetic-personality-llms.md#artículo-97) |
| 105 | Identifying Cooperative Personalities in Multi-agent Contexts | 2024 | [Ver →](state-of-the-art-synthetic-personality-llms.md#artículo-105) |
| 106 | The Impact of Big Five Personality Traits on AI Agent Decision-Making | 2024 | [Ver →](state-of-the-art-synthetic-personality-llms.md#artículo-106) |
| 107 | Signs of Consciousness in AI: Can GPT-3 Tell How Smart It Really Is? | 2024 | [Ver →](state-of-the-art-synthetic-personality-llms.md#artículo-107) |
| 108 | An Evolutionary Model of Personality Traits Related to Cooperative Behavior | 2024 | [Ver →](state-of-the-art-synthetic-personality-llms.md#artículo-108) |
| 109 | Cultural Bias and Cultural Alignment of Large Language Models | 2024 | [Ver →](state-of-the-art-synthetic-personality-llms.md#artículo-109) |
| 110 | Artificial Intelligence, Human Cognition, and Conscious Supremacy | 2024 | [Ver →](state-of-the-art-synthetic-personality-llms.md#artículo-110) |
| 111 | Designing Personality-Adaptive Conversational Agents for Mental Health Care | 2024 | [Ver →](state-of-the-art-synthetic-personality-llms.md#artículo-111) |
| 113 | Systematic Evaluation of GPT-3 for Zero-Shot Personality Estimation | 2023 | [Ver →](state-of-the-art-synthetic-personality-llms.md#artículo-113) |
| 114 | The Plasticity of ChatGPT's Mentalizing Abilities: Personalization | 2023 | [Ver →](state-of-the-art-synthetic-personality-llms.md#artículo-114) |
| 119 | Pushing on Personality Detection from Verbal Behavior: A Transformer Meets Text Contours | 2022 | [Ver →](state-of-the-art-synthetic-personality-llms.md#artículo-119) |
| 123 | The Illusion of Personality: Uncovering Dissociation Between Self-Reports and Behavior in LLMs | 2025 | [Ver →](state-of-the-art-synthetic-personality-llms.md#article-123) |
| 131 | AI Agent Behavioral Science: Dynamics of Multi-Agent Societies and Applications for Behavioral Economics | 2025 | [Ver →](state-of-the-art-synthetic-personality-llms.md#article-131) |
| 132 | Personality as a Probe for LLM Evaluation: Unveiling Consistency, Stability, and Generalizability | 2025 | [Ver →](state-of-the-art-synthetic-personality-llms.md#article-132) |
| 133 | Multilingual != Multicultural: A Case Study of How Culturally Aligned LLMs Really Are | 2025 | [Ver →](state-of-the-art-synthetic-personality-llms.md#article-133) |
| 134 | How Well Do LLMs Represent Values Across Cultures? Empirical Analysis Based on Hofstede Cultural Dimensions | 2025 | [Ver →](state-of-the-art-synthetic-personality-llms.md#article-134) |
| 135 | CultureLLM: Incorporating Cultural Differences into Large Language Models | 2024 | [Ver →](state-of-the-art-synthetic-personality-llms.md#article-135) |
| 136 | Fluent but Foreign: Regional LLMs Lack Cultural Alignment Despite Language Fluency | 2025 | [Ver →](state-of-the-art-synthetic-personality-llms.md#article-136) |
| 138 | Evaluating Cultural Awareness of LLMs via Analyzing Reward Models for RLHF Preferences: A Case Study Using CARB Dataset | 2024 | [Ver →](state-of-the-art-synthetic-personality-llms.md#article-138) |
| 139 | Aligning to What? Limits to Personality-Based RLHF Alignment for Large Language Models | 2025 | [Ver →](state-of-the-art-synthetic-personality-llms.md#article-139) |
| 141 | Adversarial RLHF: How Personality Can Be Misaligned Through Reward Hacking | 2025 | [Ver →](state-of-the-art-synthetic-personality-llms.md#article-141) |
| 142 | A Survey of Large Language Models in Psychotherapy: Evaluating Empathy, Personality Consistency, and Clinical Effectiveness | 2025 | [Ver →](state-of-the-art-synthetic-personality-llms.md#article-142) |
| 144 | Reasoning Is Not All You Need: A Multi-Turn Analysis of Mental Health Counseling with Large Language Models | 2025 | [Ver →](state-of-the-art-synthetic-personality-llms.md#article-144) |
| 145 | Can Large Language Models Be a Dangerous Persuader? Personality-Driven Persuasion Strategies and Their Ethical Implications | 2025 | [Ver →](state-of-the-art-synthetic-personality-llms.md#article-145) |
| 146 | Can Generative Agent-Based Modeling Replicate Social Phenomena? The Case of the Friendship Paradox with Personality-Driven Agents | 2025 | [Ver →](state-of-the-art-synthetic-personality-llms.md#article-146) |
| 147 | Persuasion and Safety in the Era of Generative AI: Understanding Personality-Based Manipulation Risks | 2025 | [Ver →](state-of-the-art-synthetic-personality-llms.md#article-147) |
| 148 | FairEval: Evaluating Fairness in Personality-Aware Recommendation Systems Powered by LLMs | 2025 | [Ver →](state-of-the-art-synthetic-personality-llms.md#article-148) |
| 149 | CFaiRLLM: Consumer Fairness Evaluation for Recommendation Systems Using Large Language Models with Personality Profiling | 2025 | [Ver →](state-of-the-art-synthetic-personality-llms.md#article-149) |

En esta categoría se miden los usos prácticos de personalidades sintéticas (robótica, Chatbots, asistentes, simulaciones sociales sobre IA), sesgos en sistemas (como género, raza, estereotipos y preferencias sociales), preocupaciones de seguridad (como toxicidad o Tríada Oscura), y detección de la personalidad.

La hipótesis central es que los LLMs con personalidad sintética exhiben sesgos sistemáticos que reflejan estereotipos presentes en los datos de entrenamiento. La personalidad del modelo de los distintos LLMs realmente da forma a cómo actúan más adelante con los usuarios.

---

## ESTADÍSTICAS DE CATEGORIZACIÓN

| Categoría | Artículos | Porcentaje | 2022 | 2023 | 2024 | 2025 |
|-----------|-----------|------------|------|------|------|------|
| Evaluación y validación psicométrica | 50 | 33.3% | 4 | 5 | 26 | 15 |
| Inducción y control de personalidad | 45 | 30.0% | 1 | 3 | 20 | 21 |
| Aplicaciones, sesgos y consecuencias sociales | 55 | 36.7% | 3 | 7 | 21 | 24 |
| **TOTAL** | **150** | **100%** | **8** | **15** | **67** | **60** |

La distribución de datos entre categorías (33.3%, 30.0%, 36.7%) refleja líneas de investigación bien establecidas. El crecimiento en 2024 (67 artículos, 44.7% del total) coincide con la disponibilidad de modelos instruccionales avanzados (GPT-4, Claude 3, Llama 2/3, Gemini 1.5). En 2025, el cambio se produce hacia aplicaciones y sesgos (24 artículos, 40.0% del año) señala el giro del campo hacia implementaciones prácticas, preocupaciones éticas y análisis de modelos de razonamiento (o1, o3-mini, Claude 3.5 Sonnet/Opus). El incremento en inducción y control en 2025 (21 artículos, 35.0%) refleja interés en técnicas avanzadas de steering y personalización de agentes para aplicaciones específicas.
