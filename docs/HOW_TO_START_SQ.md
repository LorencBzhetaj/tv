# Udhëzuesi i përdorimit — LORI TV (shqip)

## Çfarë përmban ZIP-i
- `CLAUDE.md`: rregullat e përhershme të Claude Code.
- `docs/`: arkitektura, fazat, UI/UX, testet, tracker dhe vendimet teknike.
- `mockups/tv/`: 18 PNG (17 bazë + 1 Cast) për Samsung.
- `mockups/remote/`: 9 PNG (6 bazë + 3 Cast) për telefon.
- `mockups/manager/`: 8 ekrane për panelin web.
- `prompts/`: prompti fillestar, një prompt për secilën fazë dhe prompti i auditimit.

## Tani, pa nisur kodimin
1. Shkarko ZIP-in dhe nxirre në një dosje `lori-tv`.
2. Shiko PNG-të sipas radhës në `mockups/` dhe shëno ndryshimet që dëshiron.
3. Ruaj paketën; **mos nis promptet e fazave** derisa të japësh miratimin.

## Kur të thuash «fillojmë»
1. Instalo/hap Claude Code në kompjuter; hap dosjen `lori-tv` si working directory.
2. Verifiko që `CLAUDE.md` ndodhet në root dhe dokumentet në `docs/`.
3. Kopjo në Claude Code tekstin nga `prompts/00_BOOTSTRAP_READ_ONLY.md`. Ky prompt lejon vetëm lexim dhe raport; **nuk lejon kodim**.
4. Lexo raportin. Vetëm nëse je dakord, jep miratimin për Fazën 00 me `prompts/01_PHASE_00_COMPATIBILITY.md`.
5. Për Fazën 00 duhet akses fizik në Samsung dhe Windows PC me Tizen Studio; Claude Code duhet të udhëzojë, jo të pretendojë se ka testuar TV-në pa prova.
6. Në fund të çdo faze kërko raportin me teste, ndryshime, probleme dhe gate approval. Për auditim përdor `prompts/99_CODEX_REVIEW.md` vetëm në fazat kryesore.
7. Kalo te prompti pasardhës **vetëm pasi** të kesh miratuar fazën e mëparshme.

## Rregulla kursimi credits
- Një fazë për herë; pa implementim të gjithë projektit me një prompt.
- Dy tentativa automatike maksimum për një gabim; pastaj STOP.
- Mos instalo dependencies të panevojshme, mos shto backend pa ADR, mos bëj deploy pa leje.
- Mos e shëno asnjë fazë COMPLETED pa prova të testeve dhe miratimin tënd.

## Shënime
TV modeli i saktë, versioni Tizen, mënyra e instalimit dhe transporti i telekomandës **nuk janë ende të verifikuara**. Katalogu i përmbajtjeve do të kërkojë burime me të drejta përdorimi. Mockupet janë shembuj, jo përmbajtje e garantuar.

## Shtesë v3.1 — LORI Cast
Pas përfundimit dhe miratimit të Fazës 07 (LORI Remote), përdor `prompts/08B_PHASE_07B_LORI_CAST.md`. Kjo është një nënfazë më vete dhe kërkon miratim të veçantë. Synimi është dërgimi **vetëm i videos së zgjedhur** nga telefoni në TV, pa pasqyrimin e ekranit ose njoftimeve. AirPlay i integruar i Samsung është funksion i veçantë. Katër koncepte Cast ekzistojnë; duhen rishikuar. Mockupet Gallery/Files/Video URL dhe gjendjet e transferimit mbeten për t’u projektuar (shih MOCKUP_INDEX.md).


## Shtesa v3.3 — LORI Cast External Media
Në Fazën 07B do të shtohen: (1) video nga Galeria, (2) skedarë video nga Files, (3) URL direkte videoje të autorizuar. Mos fillo implementimin pa provuar kompatibilitetin në Samsung dhe pa miratimin e fazës. PWA mund të hapë file picker, por jo domosdoshmërisht menunë Share të iPhone. Çdo funksion duhet testuar veçmas.
