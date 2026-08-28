console.log('Module: hapkido-vocab.js loaded');
/**
 * Module: hapkido-vocab.js
 * Part of Hapkido Athlete Measurement SPA
 */

HapkidoApp.prototype.initVocabulary = function() {
        this.vocabularyData = [
            // Zonas del cuerpo
            { kor: "Mom", phon: "Mom", han: "몸", esp: "Cuerpo", cat: "cuerpo" },
            { kor: "Meori", phon: "Mouri / Meori", han: "머리", esp: "Cabeza / Pelo", cat: "cuerpo" },
            { kor: "Ima", phon: "Ima", han: "이마", esp: "Frente", cat: "cuerpo" },
            { kor: "Gwi", phon: "Gwi / Kui", han: "귀", esp: "Oreja", cat: "cuerpo" },
            { kor: "Nun", phon: "Nun", han: "눈", esp: "Ojo", cat: "cuerpo" },
            { kor: "Ko", phon: "Ko", han: "코", esp: "Nariz", cat: "cuerpo" },
            { kor: "Ip", phon: "Ip", han: "입", esp: "Boca", cat: "cuerpo" },
            { kor: "Teok", phon: "Tok / Teok", han: "턱", esp: "Mentón / Mandíbula", cat: "cuerpo" },
            { kor: "Mok", phon: "Mok", han: "목", esp: "Cuello", cat: "cuerpo" },
            { kor: "Mokdeolmi", phon: "Mokdolmy / Mokdeolmi", han: "목덜미", esp: "Nuca", cat: "cuerpo" },
            { kor: "Eokkae", phon: "Oke / Eokkae", han: "어깨", esp: "Hombro", cat: "cuerpo" },
            { kor: "Gaseum", phon: "Gasum / Gaseum", han: "가슴", esp: "Pecho", cat: "cuerpo" },
            { kor: "Myeongchi", phon: "Myung Chi / Myeongchi", han: "명치", esp: "Boca del estómago / Plexo solar", cat: "cuerpo" },
            { kor: "Bae", phon: "Be / Bae", han: "배", esp: "Abdomen / Estómago", cat: "cuerpo" },
            { kor: "Heori", phon: "Heori (fon. Jori)", han: "허리", esp: "Cintura", cat: "cuerpo" },
            { kor: "Deung", phon: "Dung / Deung", han: "등", esp: "Espalda / Dorso", cat: "cuerpo" },
            { kor: "Pal", phon: "Pal", han: "팔", esp: "Brazo", cat: "cuerpo" },
            { kor: "Sonmok", phon: "Son Mok / Sonmok", han: "손목", esp: "Muñeca", cat: "cuerpo" },
            { kor: "Son-garak", phon: "Son Karak / Songarak", han: "손가락", esp: "Dedos de la mano", cat: "cuerpo" },
            { kor: "Bal-garak", phon: "Bal Karak / Balgarak", han: "발가락", esp: "Dedos del pie", cat: "cuerpo" },
            { kor: "Galbi", phon: "Galbi", han: "갈비", esp: "Costillas", cat: "cuerpo" },
            { kor: "Eondeong-i", phon: "Ondungui / Eondeongi", han: "엉덩이", esp: "Nalga / Glúteo", cat: "cuerpo" },
            { kor: "Dari", phon: "Dari", han: "다리", esp: "Pierna", cat: "cuerpo" },
            { kor: "Balmok", phon: "Bal Mok / Balmok", han: "발목", esp: "Tobillo", cat: "cuerpo" },
            { kor: "Baldeung", phon: "Baldung / Baldeung", han: "발등", esp: "Empeine", cat: "cuerpo" },
            { kor: "Balbadak", phon: "Balbadak (err. Bal Batang)", han: "발바닥", esp: "Planta del pie", cat: "cuerpo" },
            { kor: "Dwichuk", phon: "Dwichuk", han: "뒤축", esp: "Talón (parte ósea / filo inferior)", cat: "cuerpo" },
            { kor: "Dwitkumchi", phon: "Dikumchi / Dikunchi", han: "뒤꿈치", esp: "Talón (tendón / borde blando)", cat: "cuerpo" },
            { kor: "Apchuk", phon: "Apchuk", han: "앞축", esp: "Metatarso / Bola del pie", cat: "cuerpo" },
            { kor: "Dwichuk Himjul", phon: "Dwichuk jimchul (Tendón Aquiles)", han: "뒤축 힘줄", esp: "Tendón de Aquiles", cat: "cuerpo" },
            { kor: "Michu / Migol", phon: "Michu / Migol", han: "미추 / 미골", esp: "Cóccix / Columna baja", cat: "cuerpo" },
            { kor: "Eolgul", phon: "Eolgul / El Kul", han: "얼굴", esp: "Cara / Nivel Alto (cuello arriba)", cat: "cuerpo" },
            { kor: "Momtong", phon: "Montong / Momtong", han: "몸통", esp: "Cuerpo / Nivel Medio (cuello a cintura)", cat: "cuerpo" },
            { kor: "Arae", phon: "Are / Arae", han: "아래", esp: "Abajo / Nivel Bajo (cintura abajo)", cat: "cuerpo" },
            { kor: "Son", phon: "Son", han: "손", esp: "Mano", cat: "cuerpo" },

            // Direcciones y Zonas
            { kor: "Oreun", phon: "Orun / Oreun", han: "오른", esp: "Derecha / Lado derecho", cat: "direcciones" },
            { kor: "Wen", phon: "Uen / Wen", han: "왼", esp: "Izquierda / Lado izquierdo", cat: "direcciones" },
            { kor: "Ap", phon: "Ap / Aap", han: "앞", esp: "Al frente / Adelante", cat: "direcciones" },
            { kor: "Dwi / Dwit", phon: "Di / Tuit / Dwit", han: "뒤 / 뒷", esp: "Atrás / Reverso / Detrás", cat: "direcciones" },
            { kor: "Bandae", phon: "Bande / Bandae", han: "반대", esp: "Lado contrario / Oponente", cat: "direcciones" },
            { kor: "Baro", phon: "Baro", han: "바로", esp: "Lado del mismo pie (retorno / alineación)", cat: "direcciones" },
            { kor: "An", phon: "An", han: "안", esp: "Adentro / Interno", cat: "direcciones" },
            { kor: "Bakkat", phon: "Bakkat (err. Bakkator)", han: "바깥", esp: "Afuera / Externo", cat: "direcciones" },
            { kor: "Hadan", phon: "Hadan / Hadán", han: "하단", esp: "Nivel bajo / Zona inferior", cat: "direcciones" },
            { kor: "Jungdan", phon: "Chungdan / Jungdan", han: "중단", esp: "Nivel medio / Zona media", cat: "direcciones" },
            { kor: "Sangdan", phon: "Sangdan", han: "상단", esp: "Nivel alto / Zona superior", cat: "direcciones" },
            { kor: "Yeop", phon: "Yop / Iop / Yeop", han: "옆", esp: "De lado / Lateral", cat: "direcciones" },

            // ── Conceptos Raíz y Terminología de Superficie ───────────────
            { kor: "Seogi",    phon: "Sogui / Seogi",          han: "서기",   esp: "Posición / Postura de pies (concepto raíz)", cat: "tecnicas" },
            { kor: "Chagi",    phon: "Chagui / Chagi",         han: "차기",   esp: "Patada (concepto raíz)", cat: "tecnicas" },
            { kor: "Jireugi",  phon: "Chirigui / Jireugi",     han: "지르기", esp: "Golpe de puño penetrante (concepto raíz)", cat: "tecnicas" },
            { kor: "Chigi",    phon: "Chigui / Chigi",         han: "치기",   esp: "Golpe con superficie específica: mano abierta, canto, codo, palma (concepto raíz)", cat: "tecnicas" },
            { kor: "Makgi",    phon: "Makki / Makgi",          han: "막기",   esp: "Bloqueo / Defensa (concepto raíz)", cat: "tecnicas" },
            { kor: "Kkeokgi",  phon: "Kokki / Kkeokgi",        han: "꺾기",   esp: "Luxación / Palanca / Llave articular (concepto raíz)", cat: "tecnicas" },
            { kor: "Deonjigi", phon: "Donchigui / Deonjigi",   han: "던지기", esp: "Proyección / Lanzamiento / Derribo (concepto raíz)", cat: "tecnicas" },
            { kor: "Nakbeop",  phon: "Nakbop / Nakbeop",       han: "낙법",   esp: "Técnica de caída segura / Rodada controlada", cat: "tecnicas" },
            { kor: "Jumok",    phon: "Chumok / Jumok",         han: "주먹",   esp: "Puño cerrado (superficie de golpe)", cat: "tecnicas" },
            { kor: "Sonnal",   phon: "Sonnal / Sonal",         han: "손날",   esp: "Filo o canto externo de la mano (superficie de golpe/bloqueo)", cat: "tecnicas" },
            { kor: "Palgup",   phon: "Palkup / Palgup",        han: "팔굽",   esp: "Codo (superficie de golpe o bloqueo)", cat: "tecnicas" },
            { kor: "Palmok",   phon: "Palmok",                 han: "팔목",   esp: "Antebrazo (superficie de bloqueo o impacto)", cat: "tecnicas" },
            { kor: "Twigi",    phon: "Tio / Twigi",            han: "뛰기",   esp: "Saltar / Aéreo (prefijo para técnicas saltadas)", cat: "tecnicas" },
            { kor: "Gureugi",  phon: "Gureugi / Gechong",      han: "구르기", esp: "Rodar / Rodada técnica en el suelo", cat: "tecnicas" },
            { kor: "Gyeokpa",  phon: "Kiopa / Gyeokpa",        han: "격파",   esp: "Rompimiento de tablas, tejas o bloques", cat: "tecnicas" },
            { kor: "Hyung",    phon: "Jiung / Hyung",          han: "형",    esp: "Formas preestablecidas / secuencias técnicas de combate imaginario", cat: "tecnicas" },
            { kor: "Anja",     phon: "Anja / Anyo",            han: "앉아",   esp: "Sentarse / Sentado — mando del instructor", cat: "tecnicas" },
            { kor: "Bal Bakkwo",phon: "Bal Bako / Bal Bakkwo", han: "발 바꿔", esp: "Cambiar de pie / Cambiar de guardia — mando", cat: "tecnicas" },
            { kor: "Iroseo",   phon: "Iroso / Iroseo",         han: "일어서", esp: "Levantarse / Ponerse de pie — mando", cat: "tecnicas" },

            // ── Posiciones y Guardias (Seogi / Gubi) ──────────────────────
            { kor: "Moa Seogi",     phon: "Moa Sogui / Moa Seogi",         han: "모아서기",   esp: "Posición de atención — pies juntos (firmes)", cat: "tecnicas" },
            { kor: "Naranhi Seogi", phon: "Naranjui Sogui / Naranhi Seogi", han: "나란히서기",  esp: "Posición paralela — pies al ancho de hombros, paralelos", cat: "tecnicas" },
            { kor: "Juchum Seogi",  phon: "Chuchum Sogui / Juchum Seogi",   han: "주춤서기",   esp: "Posición de jineta / montar a caballo — caderas bajas, piernas abiertas", cat: "tecnicas" },
            { kor: "Ap Seogi",      phon: "Ap Sogui / Ap Seogi",            han: "앞서기",    esp: "Posición de caminar corta / adelantada (short walking stance)", cat: "tecnicas" },
            { kor: "Ap Gubi",       phon: "Apgubi / Ap Gubi",               han: "앞구비",    esp: "Posición adelantada larga — flexión anterior profunda (front stance)", cat: "tecnicas" },
            { kor: "Dwit Gubi",     phon: "Dikubi / Dwit Gubi",             han: "뒷구비",    esp: "Posición posterior — 70% peso atrás, pierna trasera en L (back stance)", cat: "tecnicas" },
            { kor: "Niunja Seogi",  phon: "Niunja Sogui / Niunja Seogi",    han: "니은자서기",  esp: "Posición en L — variante con angulación definida del pie trasero", cat: "tecnicas" },
            { kor: "Beom Seogi",    phon: "Bom Sogui / Beom Seogi",         han: "범서기",    esp: "Posición del tigre / gato — apoyo en metatarso frontal, 90% peso atrás", cat: "tecnicas" },
            { kor: "Koa Seogi",     phon: "Koa Sogui / Koa Seogi",          han: "꼬아서기",   esp: "Posición cruzada — piernas cruzadas, inestable por diseño", cat: "tecnicas" },

            // ── Bloqueos (Makgi) ───────────────────────────────────────────
            { kor: "Arae Makgi",    phon: "Are Makki / Arae Makgi",         han: "아래막기",   esp: "Bloqueo bajo — desvía ataques a la zona inferior (low block)", cat: "tecnicas" },
            { kor: "Momtong Makgi", phon: "Montong Makki / Momtong Makgi",  han: "몸통막기",   esp: "Bloqueo medio — protege el tronco (mid-section block)", cat: "tecnicas" },
            { kor: "Eolgul Makgi",  phon: "El Kul Makki / Eolgul Makgi",    han: "얼굴막기",   esp: "Bloqueo alto — protege cara y cabeza (rising / high block)", cat: "tecnicas" },
            { kor: "Bakkat Makgi",  phon: "Bakkat Makki / Bakkat Makgi",    han: "바깥막기",   esp: "Bloqueo hacia afuera — desvío externo del antebrazo (outward block)", cat: "tecnicas" },
            { kor: "An Makgi",      phon: "An Makki / An Makgi",            han: "안막기",    esp: "Bloqueo hacia adentro — desvío interno del antebrazo (inward block)", cat: "tecnicas" },
            { kor: "Sonnal Makgi",  phon: "Sonnal Makki / Sonnal Makgi",    han: "손날막기",   esp: "Bloqueo con filo de mano — canto externo del antebrazo (knife-hand block)", cat: "tecnicas" },

            // ── Golpes de Puño (Jireugi) ───────────────────────────────────
            { kor: "Momtong Jireugi",   phon: "Montong Chirigui / Momtong Jireugi",     han: "몸통지르기",  esp: "Golpe de puño al tronco — nivel medio (straight punch, mid section)", cat: "tecnicas" },
            { kor: "Eolgul Jireugi",    phon: "El Kul Chirigui / Eolgul Jireugi",       han: "얼굴지르기",  esp: "Golpe de puño a la cara — nivel alto (punch to the face / head)", cat: "tecnicas" },
            { kor: "Hadan Jireugi",     phon: "Hadan Chirigui / Hadan Jireugi",         han: "하단지르기",  esp: "Golpe de puño bajo — nivel inferior (low section punch)", cat: "tecnicas" },
            { kor: "Baro Jireugi",      phon: "Baro Chirigui / Baro Jireugi",           han: "바로지르기",  esp: "Puño directo del lado adelantado — sin rotación (jab)", cat: "tecnicas" },
            { kor: "Bandae Jireugi",    phon: "Bande Chirigui / Bandae Jireugi",        han: "반대지르기",  esp: "Puño inverso / cruzado del lado posterior (cross punch)", cat: "tecnicas" },
            { kor: "Yeop Jireugi",      phon: "Iop Chirigui / Yeop Jireugi",            han: "옆지르기",   esp: "Golpe de puño lateral (side punch)", cat: "tecnicas" },
            { kor: "Sewo Jireugi",      phon: "Suo Chirigui / Sewo Jireugi",            han: "세워지르기",  esp: "Golpe de puño con puño en posición vertical (vertical punch)", cat: "tecnicas" },
            { kor: "Dollyo Jireugi",    phon: "Dollio Chirigui / Dollyo Jireugi",       han: "돌려지르기",  esp: "Puño en gancho / circular — giro de cadera (hook punch)", cat: "tecnicas" },
            { kor: "Danggyeo Jireugi",  phon: "Danggio Chirigui / Danggyeo Jireugi",    han: "당겨지르기",  esp: "Puño con tracción — jalar al oponente hacia el golpe (pull punch)", cat: "tecnicas" },

            // ── Golpes con Otras Superficies (Chigi) ──────────────────────
            { kor: "Sonnal Chigi",       phon: "Sonnal Chigui / Sonnal Chigi",             han: "손날치기",   esp: "Golpe con filo externo de la mano — canto lateral (knife-hand strike / karate chop)", cat: "tecnicas" },
            { kor: "Sonnal Deung Chigi", phon: "Sonnal Dung Chigui / Sonnal Deung Chigi",  han: "손날등치기",  esp: "Golpe con el dorso del filo de mano — reverso del canto (ridge-hand / back knife-hand)", cat: "tecnicas" },
            { kor: "Batangson Chigi",    phon: "Batangson Chigui / Batangson Chigi",       han: "바탕손치기",  esp: "Golpe con talón de la palma — base de la mano abierta (palm heel strike)", cat: "tecnicas" },
            { kor: "Palgup Chigi",       phon: "Palkup Chigui / Palgup Chigi",             han: "팔굽치기",   esp: "Codazo — golpe con el codo en cualquier dirección (elbow strike)", cat: "tecnicas" },
            { kor: "Mureup Chigi",       phon: "Mureup Chigui / Mureup Chigi",             han: "무릎치기",   esp: "Rodillazo — golpe con la rodilla (knee strike)", cat: "tecnicas" },
            { kor: "Deung Joomok Chigi", phon: "Dung Chumok Chigui / Deung Joomok Chigi", han: "등주먹치기",  esp: "Golpe con el dorso del puño — revés del puño (back fist strike)", cat: "tecnicas" },
            { kor: "Me Joomok Chigi",    phon: "Me Chumok Chigui / Me Joomok Chigi",       han: "메주먹치기",  esp: "Golpe de martillo — filo inferior del puño (hammer fist strike)", cat: "tecnicas" },

            // ── Patadas (Chagi) ────────────────────────────────────────────
            { kor: "Ap Chagi",        phon: "Ap Chagui / Ap Chagi",               han: "앞차기",    esp: "Patada frontal — empuje o golpe de frente con metatarso o punta (front kick)", cat: "tecnicas" },
            { kor: "Yeop Chagi",      phon: "Iop Chagui / Yeop Chagi",            han: "옆차기",    esp: "Patada lateral — golpe de costado con el pie o talón (side kick)", cat: "tecnicas" },
            { kor: "Dollyo Chagi",    phon: "Dollio Chagui / Dollyo Chagi",       han: "돌려차기",   esp: "Patada circular — giro de cadera con el empeine o talón (roundhouse kick)", cat: "tecnicas" },
            { kor: "Dwi Chagi",       phon: "Di Chagui / Dwi Chagi",             han: "뒤차기",    esp: "Patada trasera — hacia atrás con el talón o planta (back kick)", cat: "tecnicas" },
            { kor: "Naeryo Chagi",    phon: "Neryo Chagui / Naeryo Chagi",        han: "내려차기",   esp: "Patada descendente / hacha — impacto con el talón de arriba hacia abajo (axe kick)", cat: "tecnicas" },
            { kor: "Bandal Chagi",    phon: "Bantal Chagui / Bandal Chagi",       han: "반달차기",   esp: "Patada media luna — arco exterior o interior con el empeine (crescent kick)", cat: "tecnicas" },
            { kor: "Momdollyo Chagi", phon: "Momdollio Chagui / Momdollyo Chagi", han: "몸돌려차기",  esp: "Patada giratoria — giro completo del cuerpo con cualquier superficie del pie (spinning kick)", cat: "tecnicas" },
            { kor: "Twieo Chagi",     phon: "Tio Chagui / Twieo Chagi",           han: "뛰어차기",   esp: "Patada saltada — cualquier tipo de patada ejecutada en el aire (jumping kick)", cat: "tecnicas" },
            { kor: "Biteureo Chagi",  phon: "Bitureo Chagui / Biteureo Chagi",    han: "비틀어차기",  esp: "Patada torcida — giro de cadera hacia adentro al impactar (twisting kick)", cat: "tecnicas" },
            { kor: "Mureup Chagi",    phon: "Mureup Chagui / Mureup Chagi",        han: "무릎차기",   esp: "Rodillazo / Patada con la rodilla — impacto a corta distancia (knee kick)", cat: "tecnicas" },

            // Términos Generales
            { kor: "Hapkido", phon: "Hapkido", han: "합기도", esp: "Camino de la armonía y la energía", cat: "generales" },
            { kor: "Dobok", phon: "Dobok / Ddobok", han: "도복", esp: "Uniforme oficial de entrenamiento", cat: "generales" },
            { kor: "Dojang", phon: "Dojang", han: "도장", esp: "Lugar de entrenamiento / Tatami / Gimnasio", cat: "generales" },
            { kor: "Dan", phon: "Dan", han: "단", esp: "Grado de Cinturón Negro (1er a 9no Dan)", cat: "generales" },
            { kor: "Geup", phon: "Gup / Geup", han: "급", esp: "Grado de Cinturón de Color (Blanco a Marrón)", cat: "generales" },
            { kor: "Kwanjangnim", phon: "Kwanjang Nim / Kwanjangnim", han: "관장님", esp: "Director de la Escuela / Gran Maestro (5to Dan+)", cat: "generales" },
            { kor: "Sabeomnim", phon: "Sabon Nim / Sabeomnim", han: "사범님", esp: "Maestro / Instructor principal (4to Dan+)", cat: "generales" },
            { kor: "Kyosanim", phon: "Kyosa Nim / Kyosanim", han: "교사님", esp: "Instructor asistente / Profesor (1er a 3er Dan)", cat: "generales" },
            { kor: "Jogyonim", phon: "Jogyo Nim / Jogyonim", han: "조교님", esp: "Ayudante de clase / Asistente / Monitor", cat: "generales" },
            { kor: "Seonbae", phon: "Sombe / Seonbae", han: "선배", esp: "Practicante Senior (mayor grado / antigüedad)", cat: "generales" },
            { kor: "Hubae", phon: "Jombe / Hubae", han: "후배", esp: "Practicante Junior (menor grado / antigüedad)", cat: "generales" },
            { kor: "Charyeot", phon: "Chariot / Charyeot", han: "차렷", esp: "Posición de firmes / Atención", cat: "generales" },
            { kor: "Gyeongnye", phon: "Kiungye / Gyeongnye", han: "경례", esp: "Saludo / Reverencia de respeto", cat: "generales" },
            { kor: "Junbi", phon: "Choombi / Junbi", han: "준비", esp: "Preparados / Posición de atención en guardia", cat: "generales" },
            { kor: "Sijak", phon: "Sichak / Sijak", han: "시작", esp: "Comenzar / Empezar combate o técnica", cat: "generales" },
            { kor: "Geuman", phon: "Gguman / Geuman", han: "그만", esp: "Detenerse / Finalizar la acción", cat: "generales" },
            { kor: "Galryeo", phon: "Kalyo / Galryeo", han: "갈려", esp: "Separarse (mando del árbitro central)", cat: "generales" },
            { kor: "Gyesok", phon: "Kesok / Gyesok", han: "계속", esp: "Continuar el combate", cat: "generales" },
            { kor: "Gihap", phon: "Kihap", han: "기합", esp: "Grito de energía y concentración del espíritu", cat: "generales" },
            { kor: "Daeryeon", phon: "Deryon / Daeryeon", han: "대련", esp: "Combate deportivo / Sparring", cat: "generales" },
            { kor: "Hosin-sul", phon: "Ho Shin Sul / Hosinsul", han: "호신술", esp: "Técnicas de defensa personal real", cat: "generales" },
            { kor: "Danjeon Hoheup", phon: "Danjun Hohup / Danjeonhoheup", han: "단전호흡", esp: "Respiración abdominal para acumular energía", cat: "generales" },
            { kor: "Mungnyeom", phon: "Mukniong / Moknyeong / Mungnyeom", han: "묵념", esp: "Meditación en silencio / Concentración pasiva (cerrando ojos)", cat: "generales" },
            { kor: "Gomapseumnida", phon: "Gomadsumida / Gomapseumnida", han: "고맙습니다", esp: "Muchas gracias (agradecimiento informal / cortesía)", cat: "generales" },
            { kor: "Kamsahamnida", phon: "Kamsahamnida", han: "감사합니다", esp: "Muchas gracias (agradecimiento formal)", cat: "generales" },
            { kor: "Dojunim", phon: "Dojunim", han: "도주님", esp: "Gran Maestro Fundador (dueño del camino)", cat: "generales" },
            { kor: "Bong", phon: "Bong", han: "봉", esp: "Palo largo (arma tradicional de madera)", cat: "generales" },
            { kor: "Danbong", phon: "Tanbo / Tan Bong / Danbong", han: "단봉", esp: "Palo o bastón corto", cat: "generales" },
            { kor: "Ssangjeolbong", phon: "Sancholbong / Ssangjeolbong", han: "쌍절봉", esp: "Nunchaku (bastón de dos secciones - Sancholbong es fon. errónea)", cat: "generales" },
            { kor: "Tti", phon: "Ti / Tti", han: "띠", esp: "Cinturón marcial", cat: "generales" },
            { kor: "Kukki-e daehayeo gyeongnye", phon: "Kukite hayo kiungye (fon. errónea)", han: "국기에 대하여 경례", esp: "Saludo a las banderas nacionales e institucionales", cat: "generales" },
            { kor: "Sabeomnim-kke gyeongnye", phon: "Sabon-nim ke kiungye (fon. errónea)", han: "사범님께 경례", esp: "Saludo de cortesía y respeto al Maestro de la clase", cat: "generales" },
            { kor: "Bosabeonim", phon: "Bosabeonim / Bosabum", han: "부사범님", esp: "Sub-Maestro o Instructor Principal Adjunto (usualmente cinturón negro 2.º o 3.º Dan). Rango intermedio superior a Jogyonim y Kyosanim, e inferior a Sabeonim.", cat: "generales" },
            
            // Números coreanos - Conteo Nativo Coreano (1 al 20 y decenas hasta 100/1000/10000 con sonidos diferentes)
            { kor: "Hana", phon: "JANA", han: "하나", esp: "Uno (1) - Conteo Nativo (repeticiones y ejercicios)", cat: "numeros" },
            { kor: "Dul", phon: "DUL", han: "둘", esp: "Dos (2) - Conteo Nativo", cat: "numeros" },
            { kor: "Set", phon: "SET", han: "셋", esp: "Tres (3) - Conteo Nativo", cat: "numeros" },
            { kor: "Net", phon: "NET", han: "넷", esp: "Cuatro (4) - Conteo Nativo", cat: "numeros" },
            { kor: "Dasot", phon: "DASOT", han: "다섯", esp: "Cinco (5) - Conteo Nativo", cat: "numeros" },
            { kor: "Yeosot", phon: "IOSOT", han: "여섯", esp: "Seis (6) - Conteo Nativo", cat: "numeros" },
            { kor: "Ilgop", phon: "ILKOP", han: "일곱", esp: "Siete (7) - Conteo Nativo", cat: "numeros" },
            { kor: "Yeodul", phon: "IODUL", han: "여덟", esp: "Ocho (8) - Conteo Nativo", cat: "numeros" },
            { kor: "Ahop", phon: "AJOP", han: "아홉", esp: "Nueve (9) - Conteo Nativo", cat: "numeros" },
            { kor: "Yeol", phon: "IOL", han: "열", esp: "Diez (10) - Conteo Nativo", cat: "numeros" },
            { kor: "Yeol Hana", phon: "IOL JANA", han: "열하나", esp: "Once (11) - Conteo Nativo", cat: "numeros" },
            { kor: "Yeol Dul", phon: "IOL DUL", han: "열둘", esp: "Doce (12) - Conteo Nativo", cat: "numeros" },
            { kor: "Yeol Set", phon: "IOLSET", han: "열셋", esp: "Trece (13) - Conteo Nativo", cat: "numeros" },
            { kor: "Yeol Net", phon: "IOL NET", han: "열넷", esp: "Catorce (14) - Conteo Nativo", cat: "numeros" },
            { kor: "Yeol Dasot", phon: "IOL DASOT", han: "열다섯", esp: "Quince (15) - Conteo Nativo", cat: "numeros" },
            { kor: "Yeol Yeosot", phon: "IOL IOSOT", han: "열여섯", esp: "Dieciséis (16) - Conteo Nativo", cat: "numeros" },
            { kor: "Yeol Ilgop", phon: "IOL ILKOP", han: "열일곱", esp: "Diecisiete (17) - Conteo Nativo", cat: "numeros" },
            { kor: "Yeol Yeodul", phon: "IOL IODUL", han: "열여덟", esp: "Dieciocho (18) - Conteo Nativo", cat: "numeros" },
            { kor: "Yeol Ahop", phon: "IOLAJOP", han: "열아홉", esp: "Diecinueve (19) - Conteo Nativo", cat: "numeros" },
            { kor: "Seomul", phon: "SUMUL", han: "스물", esp: "Veinte (20) - Conteo Nativo", cat: "numeros" },
            { kor: "Seoreun", phon: "SORUN", han: "서른", esp: "Treinta (30) - Decena nativa", cat: "numeros" },
            { kor: "Maheun", phon: "MAJUN", han: "마흔", esp: "Cuarenta (40) - Decena nativa", cat: "numeros" },
            { kor: "Swin", phon: "SHUN", han: "쉬흔 / 쉬운", esp: "Cincuenta (50) - Decena nativa", cat: "numeros" },
            { kor: "Yesun", phon: "IESHUN", han: "예순", esp: "Sesenta (60) - Decena nativa", cat: "numeros" },
            { kor: "Ilhun", phon: "IRUN", han: "일흔", esp: "Setenta (70) - Decena nativa", cat: "numeros" },
            { kor: "Yeodeun", phon: "IODUN", han: "여든", esp: "Ochenta (80) - Decena nativa", cat: "numeros" },
            { kor: "Aheun", phon: "AJUN", han: "아흔", esp: "Noventa (90) - Decena nativa", cat: "numeros" },
            { kor: "Baek", phon: "BEK", han: "백", esp: "Cien (100) - Conteo Sino-Coreano", cat: "numeros" },
            { kor: "Cheon", phon: "CHON", han: "천", esp: "Mil (1000) - Conteo Sino-Coreano", cat: "numeros" },
            { kor: "Man", phon: "MAN", han: "만", esp: "Diez Mil (10000) - Conteo Sino-Coreano", cat: "numeros" },

            // Colores más comunes en Hapkido / Torneos
            { kor: "Cheong", phon: "Chong / Cheong", han: "청", esp: "Azul (competidor azul en torneos)", cat: "generales" },
            { kor: "Hong", phon: "Hong", han: "홍", esp: "Rojo (competidor rojo en torneos)", cat: "generales" },
            { kor: "Baek", phon: "Bek / Baek", han: "백", esp: "Blanco (color del cinturón inicial)", cat: "generales" },
            { kor: "Hwang", phon: "Juang / Hwang", han: "황", esp: "Amarillo (color de cinturón básico)", cat: "generales" },
            { kor: "Geom-jeong", phon: "Komchong / Geomjeong", han: "검정", esp: "Negro (color del cinturón de maestría)", cat: "generales" },

            // Números coreanos - Conteo Sino-Coreano (1 al 10)
            { kor: "Il", phon: "Il", han: "일", esp: "Uno (1º / 1) - Conteo Sino-Coreano (grados Dan, minutos y fechas)", cat: "numeros" },
            { kor: "I", phon: "I", han: "이", esp: "Dos (2º / 2) - Conteo Sino-Coreano", cat: "numeros" },
            { kor: "Sam", phon: "Sam", han: "삼", esp: "Tres (3º / 3) - Conteo Sino-Coreano", cat: "numeros" },
            { kor: "Sa", phon: "Sa", han: "사", esp: "Cuatro (4º / 4) - Conteo Sino-Coreano", cat: "numeros" },
            { kor: "O", phon: "O", han: "오", esp: "Cinco (5º / 5) - Conteo Sino-Coreano", cat: "numeros" },
            { kor: "Yuk", phon: "Iuk / Yuk", han: "육", esp: "Seis (6º / 6) - Conteo Sino-Coreano", cat: "numeros" },
            { kor: "Chil", phon: "Chil", han: "칠", esp: "Siete (7º / 7) - Conteo Sino-Coreano", cat: "numeros" },
            { kor: "Pal", phon: "Pal", han: "팔", esp: "Ocho (8º / 8) - Conteo Sino-Coreano", cat: "numeros" },
            { kor: "Gu", phon: "Gu", han: "구", esp: "Nueve (9º / 9) - Conteo Sino-Coreano", cat: "numeros" },
            { kor: "Sip", phon: "Sip", han: "십", esp: "Diez (10º / 10) - Conteo Sino-Coreano", cat: "numeros" },

            // ── Pregón del Hapkido — Los 8 Principios Fundamentales ───────
            // Basados en el antiguo Daito Ryu del Maestro Takeda
            { kor: "Ye Uin",         phon: "Ie Uin / Ye Uin",             han: "예의",     esp: "Cortesía — Respeto y buenos modales hacia todos", cat: "principios" },
            { kor: "Jong-Chi",       phon: "Chong Chi / Jong-Chi",        han: "정직",     esp: "Integridad — Honestidad y coherencia entre palabra y acción", cat: "principios" },
            { kor: "In-Nae",         phon: "In Ne / In-Nae",              han: "인내",     esp: "Perseverancia y Paciencia — Resistir con constancia ante la adversidad", cat: "principios" },
            { kor: "Gukgui",         phon: "Kukgui / Gukgui",             han: "극기",     esp: "Autocontrol — Dominio de las emociones y los impulsos", cat: "principios" },
            { kor: "Baeyu Bu Gul",   phon: "Beyu Bu Gul / Baeyu Bu Gul",  han: "배유불굴",  esp: "Espíritu Indomable — Voluntad inquebrantable ante cualquier desafío", cat: "principios" },
            { kor: "Jong Euje",      phon: "Chong Euchie / Jong Euje",     han: "정의",     esp: "Rectitud — Actuar con justicia y hacer lo correcto", cat: "principios" },
            { kor: "Sa Chin E Hyo",  phon: "Sa Chin E Hio / Sa Chin E Hyo",han: "사친효",   esp: "Lealtad a Padres y Maestros — Devoción filial y respeto a los mayores", cat: "principios" },
            { kor: "Kyo Woo E Chin", phon: "Kio U E Chin / Kyo Woo E Chin",han: "교우의친", esp: "Confianza y Hermandad entre los Amigos — Fraternidad y solidaridad", cat: "principios" }
        ];
    }


/**
 * Detect technique sub-category from the suffix of the Korean name.
 * Returns { id, label, color } or null if not a recognizable technique family.
 * Called at render time — no need to store in data.
 */
HapkidoApp.prototype.detectTechSubcat = function(korName) {
    const n = korName.toLowerCase().trim()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    if (n.endsWith('seogi') || n.endsWith('gubi'))
        return { id: 'posicion',  label: 'Posición / Guardia', color: '#38bdf8' };
    if (n.endsWith('chagi'))
        return { id: 'chagi',    label: 'Patada',              color: '#fb923c' };
    if (n.endsWith('jireugi'))
        return { id: 'jireugi',  label: 'Golpe de Puño',       color: '#ef4444' };
    if (n.endsWith('chigi'))
        return { id: 'chigi',    label: 'Golpe / Strike',       color: '#a855f7' };
    if (n.endsWith('makgi'))
        return { id: 'makgi',    label: 'Bloqueo / Defensa',    color: '#22c55e' };
    if (n.endsWith('kkeokgi'))
        return { id: 'kkeokgi',  label: 'Llave / Luxación',     color: '#eab308' };
    if (n.endsWith('deonjigi'))
        return { id: 'deonjigi', label: 'Proyección / Derribo', color: '#06b6d4' };
    if (n.endsWith('nakbeop'))
        return { id: 'nakbeop',  label: 'Caída / Rodada',       color: '#94a3b8' };
    return null;
};


HapkidoApp.prototype.switchManualTab = function(tabId) {
        // Toggle active button
        const btns = document.querySelectorAll('.manual-tab-btn');
        if (btns.length >= 4) {
            btns.forEach(btn => btn.classList.remove('active'));
            if (tabId === 'historia') btns[0].classList.add('active');
            else if (tabId === 'protocolo') btns[1].classList.add('active');
            else if (tabId === 'vocabulario') btns[2].classList.add('active');
            else if (tabId === 'reglamento') btns[3].classList.add('active');
        }

        // Toggle active content
        document.querySelectorAll('.manual-tab-content').forEach(content => {
            content.classList.remove('active');
        });
        const activeContent = document.getElementById('manual-tab-' + tabId);
        if (activeContent) {
            activeContent.classList.add('active');
        }
    }


HapkidoApp.prototype.renderManualVocabulary = function() {
        this.filterManualVocab();
    }


HapkidoApp.prototype.filterManualVocab = function() {
        const searchInput    = document.getElementById('manual-vocab-search');
        const categorySelect = document.getElementById('manual-vocab-category');
        const subcatSelect   = document.getElementById('manual-vocab-subcat');
        const subcatBox      = document.getElementById('vocab-subcat-filter-box');
        const container      = document.getElementById('manual-vocab-list');
        if (!container) return;

        const query    = searchInput ? searchInput.value.trim() : '';
        const normalize = str => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
        const normQuery = normalize(query);
        const category  = categorySelect ? categorySelect.value : 'all';
        const subcat    = subcatSelect ? subcatSelect.value : 'all';

        // Show sub-category filter only when 'Técnicas' (or All) is selected
        if (subcatBox) {
            subcatBox.style.display = (category === 'tecnicas' || category === 'all') ? 'flex' : 'none';
        }

        const filtered = this.vocabularyData.filter(item => {
            const matchesSearch =
                normalize(item.kor).includes(normQuery) ||
                normalize(item.phon).includes(normQuery) ||
                normalize(item.han).includes(normQuery) ||
                normalize(item.esp).includes(normQuery);
            const matchesCategory = category === 'all' || item.cat === category;
            let matchesSubcat = true;
            if (subcat !== 'all') {
                if (item.cat === 'tecnicas') {
                    const detected = this.detectTechSubcat(item.kor);
                    matchesSubcat = detected ? detected.id === subcat : false;
                } else {
                    // Subcat filter only applies to technique items
                    matchesSubcat = false;
                }
            }
            return matchesSearch && matchesCategory && matchesSubcat;
        });

        if (filtered.length === 0) {
            container.innerHTML = `<div class="empty-list" style="grid-column: 1 / -1;">No se encontraron términos que coincidan con la búsqueda.</div>`;
            return;
        }

        container.innerHTML = filtered.map(item => {
            let catLabel = "General";
            if (item.cat === "cuerpo")      catLabel = "Zona del Cuerpo";
            else if (item.cat === "direcciones") catLabel = "Dirección / Zona";
            else if (item.cat === "tecnicas")    catLabel = "Técnica / Acción";
            else if (item.cat === "generales")   catLabel = "Término General";
            else if (item.cat === "numeros")     catLabel = "Números y Cifras";
            else if (item.cat === "principios")  catLabel = "Pregón / Principio";

            // Auto-detect technique sub-category from Korean suffix
            const techSubcat = item.cat === 'tecnicas' ? this.detectTechSubcat(item.kor) : null;
            const subcatBadge = techSubcat
                ? `<span class="vocab-subcat-tag" style="background:${techSubcat.color}22; color:${techSubcat.color}; border:1px solid ${techSubcat.color}55;">${techSubcat.label}</span>`
                : '';

            // Build image filename: lowercase, spaces → hyphens, no accents
            const imgKey = item.kor
                .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
                .toLowerCase()
                .replace(/\s+/g, "-")
                .replace(/[^a-z0-9\-]/g, "");

            // Attempt image for vocabulary cards (.jpg → .png → .gif → .webp)
            const imgBasePath = `docs/tecnicas/${imgKey}`;
            const imageBlock = item.cat !== "numeros" ? `
                <div class="vocab-img-wrap" id="img-wrap-${imgKey}">
                    <img
                        src="${imgBasePath}.jpg"
                        alt="Técnica: ${item.kor}"
                        class="vocab-tech-img"
                        loading="lazy"
                        onerror="
                            if(this.src.endsWith('.jpg')) { this.src='${imgBasePath}.png'; return; }
                            if(this.src.endsWith('.png')) { this.src='${imgBasePath}.gif'; return; }
                            if(this.src.endsWith('.gif')) { this.src='${imgBasePath}.webp'; return; }
                            this.closest('.vocab-img-wrap').style.display='none';
                        "
                    />
                </div>` : '';

            return `
                <div class="vocab-card ${item.cat === 'tecnicas' ? 'vocab-card--has-img' : ''}">
                    ${imageBlock}
                    <span class="vocab-korean">${item.kor} <span class="vocab-phonetic">(${item.phon})</span></span>
                    <span class="vocab-hangul">${item.han}</span>
                    <span class="vocab-spanish">${item.esp}</span>
                    ${subcatBadge}
                    <span class="vocab-cat-tag">${catLabel}</span>
                </div>
            `;
        }).join('');
    }



