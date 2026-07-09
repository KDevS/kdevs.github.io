# UiinfoHandler - Dokumentation

## Überblick

Der UiinfoHandler ist ein PlayCanvas-Script, das eine interaktive 3D-Pyramiden-Oberfläche für einen Leadership-Kurs verwaltet. Er behandelt die Inhaltsanzeige über iframes, verwaltet die Navigation zwischen verschiedenen Inhaltstypen und bietet eine nahtlose Benutzererfahrung über mehrere Interaktionsmodi hinweg.

## Kernfunktionalität

### Unterstützte Inhaltstypen

1. **Kurzinfo-Seiten** (`-kurzinfo`)
   - Schnelle Informationsseiten für jede Leadership-Ebene
   - Direkter Zugang ohne Untermenüs

2. **Untermenü-Systeme** (Ebenen 1, 4, 5, 6)
   - Interaktive Menüs mit mehreren Tool-Optionen
   - Benutzerdefinierte HTML-Dateien mit Übersetzungsunterstützung

3. **Direkte Detail-Seiten** (Ebenen 2, 3)
   - Umfassende Inhaltsseiten ohne Untermenüs
   - Vollständige Leadership-Methodologie-Erklärungen

4. **Detail-Inhaltsseiten**
   - Zugänglich über Untermenüs
   - Einzelne Tool- und Methodologie-Seiten

## Script-Attribute

### Kern-Attribute

```javascript
titleLayer: Entity          // UI-Ebene für Hover-Titel
titleText: Entity           // Text-Element für Titel
disableContent: Entity[]    // Elemente, die während Interaktion deaktiviert werden
contentLayer: Entity        // Haupt-Inhalts-Container
contentReferences: JSON[]   // Native PlayCanvas-Inhaltsreferenzen
```

### HTML-Asset-Konfiguration

```javascript
htmlAssets: JSON[] {
    contentId: string       // Eindeutige Kennung (z.B., "wichtigste-zuerst")
    htmlAsset: HTMLAsset    // Das HTML-Datei-Asset
    layer: string          // Ebenen-Bezeichnung (z.B., "layer-4")
    title: string          // Inhaltstitel
}

submenuHtmlAssets: JSON[] {
    layerId: string        // Ebenen-Kennung (z.B., "layer-4")
    htmlAsset: HTMLAsset   // Untermenü-HTML-Datei
    title: string          // Untermenü-Titel
    color: string          // Primäre Theme-Farbe
    colorDark: string      // Dunkle Theme-Farbe
}

shortInfoHtmlAssets: JSON[] {
    layerId: string        // Ebenen-Kennung (z.B., "layer-1-kurzinfo")
    htmlAsset: HTMLAsset   // Kurzinfo-HTML-Datei
    title: string          // Seitentitel
    level: number          // Leadership-Ebene (1-6)
    color: string          // Theme-Farbe
}

directDetailHtmlAssets: JSON[] {
    layerId: string        // Ebenen-Kennung (z.B., "layer-2")
    htmlAsset: HTMLAsset   // Detail-Seiten-HTML-Datei
    title: string          // Seitentitel
    level: number          // Leadership-Ebene
    color: string          // Theme-Farbe
}

deepDiveHtmlAssets: JSON[] {
    layerId: string        // Ebenen-Kennung (z.B., "layer-2")
    htmlAsset: HTMLAsset   // Detail-Seiten-HTML-Datei
    title: string          // Seitentitel
    level: number          // Leadership-Ebene
    color: string          // Theme-Farbe
}
```

## Inhalts-Routing-System

### Automatische Inhaltserkennung

Der Handler erkennt automatisch Inhaltstypen basierend auf Kennungen:

```javascript
// Kurzinfo-Erkennung
if (requestedContent.toLowerCase().includes("-kurzinfo")) {
    this.showShortInfoPage(requestedContent);
}

if(requestedContent.toLowerCase().includes("-deepdive")){
    this.showDeepDivePage(requestedContent);
    return;
}

// Untermenü-Erkennung
var submenuMappings = {
    "layer-1-details": "layer-1",
    "startklar-details": "layer-1",
    "Layer-2-Implementation": "layer-2",
    "Layer-3-Implementation" : "layer-3",
    "Layer-4-Implementation-SubMenu": "layer-4",
    "selbstfuehrung-details": "layer-4",
    "layer-5-details": "layer-5",
    "andere-fuehren-details": "layer-5",
    "layer-6-details": "layer-6",
    "lead-uebernehmen-details": "layer-6"
};

// Direct Detail Systems
var directDetailMappings = {
    "layer-2-details": "layer-2",
    "werte-details": "layer-2",
    "layer-3-details": "layer-3",
    "kultur-details": "layer-3"
};


## Nachrichten-Behandlungs-System

### Unterstützte Nachrichtentypen

Der Handler lauscht auf iframe-Nachrichten und reagiert entsprechend:

```javascript
// Navigations-Nachrichten
'close-submenu'          // Aktuelles Untermenü schließen
'close-content'          // Beliebigen Inhalt schließen
'open-content'           // Detail-Inhalt öffnen (von vorhandener HTML)
'submenu-selection'      // Detail-Inhalt öffnen (intern)
'back-to-submenu'        // Zum Untermenü von Detail zurückkehren

// Übersetzungs-Nachrichten
'request-bulk-translations'  // Mehrere Übersetzungen anfordern
'request-translation'        // Einzelne Übersetzung anfordern
```

### Nachrichten-Fluss-Beispiele

#### Detail-Inhalt aus Untermenü öffnen:
```javascript
// Von vorhandener HTML-Untermenü:
function openContent(contentId) {
    window.parent.postMessage({
        type: 'open-content',
        contentId: contentId
    }, '*');
}

// Handler empfängt und konvertiert zu:
{
    type: 'submenu-selection',
    content: contentId,
    submenu: 'layer-4'
}
```

#### Navigation zurück zum Untermenü:
```javascript
// Von Detail-Seite:
function backToSubmenu() {
    window.parent.postMessage({
        type: 'back-to-submenu',
        submenu: 'layer-4'
    }, '*');
}
```

## HTML-Datei-Integration

### Vorhandene HTML-Dateien

Der Handler bewahrt vorhandene HTML-Dateien vollständig:
- **Keine Script-Injektion** in vorhandene Dateien
- **Keine Style-Modifikationen**
- **Vollständige Bewahrung** der Übersetzungssysteme
- **Beibehaltung** der ursprünglichen Navigationsfunktionalität

### HTML-Datei-Anforderungen

Für Untermenü-HTML-Dateien:
```html
<!-- Erwartete Navigationsfunktionen -->
<script>
function openContent(contentId) {
    window.parent.postMessage({
        type: 'open-content',
        contentId: contentId
    }, '*');
}

function closeSubmenu() {
    window.parent.postMessage({
        type: 'close-submenu'
    }, '*');
}
</script>
```

Für Detail-Inhalts-HTML-Dateien:
```html
<!-- Erwartete Navigationsfunktionen -->
<script>
function backToSubmenu() {
    // Aktuelle Ebene wird automatisch bestimmt
    window.parent.postMessage({
        type: 'back-to-submenu',
        submenu: getCurrentLayer()
    }, '*');
}

function closeContent() {
    window.parent.postMessage({
        type: 'close-content'
    }, '*');
}
</script>
```

## Übersetzungssystem-Integration

### Übersetzungsanfrage-Weiterleitung

```javascript
UiinfoHandler.prototype.forwardTranslationRequest = function(event) {
    if (window.TranslationHandler && window.TranslationHandler.handleIframeTranslationRequest) {
        window.TranslationHandler.handleIframeTranslationRequest(event.data, event.source);
    } else {
        this.app.fire('iframe-translation-request', {
            data: event.data,
            source: event.source
        });
    }
};
```

### Erwartete Übersetzungsschlüssel

HTML-Dateien sollten `data-translate`-Attribute verwenden:
```html
<h1 data-translate="txt_Layer_1_Sinn_Content_SubMenu_1_1">STARTKLAR FÜR LEADERSHIP</h1>
<p data-translate="txt_Layer_1_Sinn_Content_SubMenu_1_4">Leadership-Inhalt...</p>
```

## Responsives Layout-System

### Dynamische Layout-Berechnung

```javascript
UiinfoHandler.prototype.calculateIframeLayout = function () {
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    const aspectRatio = viewportWidth / viewportHeight;
    const isIPhone = /iPhone/i.test(navigator.userAgent);
    const isFullscreen = /* Vollbild-Erkennung */;

    // Plattform-spezifische Rand-Berechnungen
    // Rückgabe: { marginTop, footerHeight, availableHeight }
};
```

### Unterstützte Plattformen
- Desktop (verschiedene Auflösungen)
- Mobile (iPhone-optimiert)
- Tablet-Orientierungen
- Vollbild-Modi

## Implementierungs-Leitfaden

### 1. Asset-Setup

1. **HTML-Dateien hochladen** als Assets in PlayCanvas
2. **Attribute konfigurieren** mit korrekten Asset-Referenzen
3. **Ebenen-IDs setzen** entsprechend dem Inhalts-Routing

### 2. Inhalts-ID-Mapping

Stelle sicher, dass Inhalts-IDs in HTML den Handler-Erwartungen entsprechen:
```javascript
// Beispiel für Selbstführung-Tools
'im-gleichgewicht-sein'
'organisiert-unterwegs'
'neue-gewohnheiten'
'endergebnis-vor-augen'
'wichtigste-zuerst'
```

### 3. Übersetzungs-Integration

Mit vorhandenem Übersetzungssystem verbinden:
```javascript
// Im Übersetzungs-Handler
this.app.on('iframe-translation-request', (data) => {
    this.handleIframeRequest(data.data, data.source);
});
```

## Fehlerbehandlung

### Fallback-Inhalts-Generierung

Wenn HTML-Assets nicht gefunden werden:
```javascript
UiinfoHandler.prototype.generateFallbackShortInfo = function (layerId) {
    return this.generateFromTemplate('shortInfo', {
        layerId: layerId,
        title: this.getLayerTitle(layerId),
        level: this.getLayerNumber(layerId),
        color: this.getLayerColor(layerId),
        content: `Information über ${layerId.replace('-kurzinfo', '')} Leadership-Aspekt.`
    });
};
```

### Inhalt nicht gefunden

```javascript
if (htmlAsset) {
    this.loadAssetContent(htmlAsset.htmlAsset, contentId, submenu, 'detail');
} else {
    alert('Inhalt nicht gefunden: ' + contentId);
}
```

## Performance-Überlegungen

### Iframe-Management
- **Einzelner iframe**-Ansatz verhindert Memory Leaks
- **Ordnungsgemäße Bereinigung** beim Inhaltswechsel
- **Effiziente DOM-Manipulation**

### Asset-Laden
- **On-Demand-Laden** von Inhalten
- **Asset-Caching** über PlayCanvas-System
- **Minimale DOM-Modifikationen**

## Best Practices

### HTML-Datei-Entwicklung
1. **Vollständige Navigation** einschließen
2. **Konsistente** Nachrichtentypen verwenden
3. **Übersetzungssystem**-Integration implementieren
4. **Responsives** Design testen

### Asset-Konfiguration
1. **Beschreibende** Inhalts-IDs verwenden
2. **Konsistente** Ebenen-Benennung beibehalten
3. **Angemessene** Farb-Themes setzen
4. **Inhalts-Beziehungen** dokumentieren

### Testing
1. **Alle Navigationspfade** testen
2. **Übersetzungs**-Integration verifizieren
3. **Responsives** Verhalten prüfen
4. **Fallback**-Inhalt validieren

## Problembehandlung

### Häufige Probleme

**Untermenü lädt nicht:**
- `layerId` in `submenuHtmlAssets` prüfen
- Verifizieren, dass HTML-Asset ordnungsgemäß hochgeladen ist
- Inhalts-Routing-Mapping bestätigen

**Navigation funktioniert nicht:**
- Sicherstellen, dass HTML erforderliche Navigationsfunktionen hat
- Nachrichtentypen entsprechen Erwartungen prüfen
- Iframe-Kommunikations-Setup verifizieren

**Übersetzungen funktionieren nicht:**
- Übersetzungssystem-Integration bestätigen
- `data-translate`-Attribute prüfen
- Nachrichten-Weiterleitung-Setup verifizieren

**Layout-Probleme:**
- `calculateIframeLayout()`-Funktion überprüfen
- Plattform-spezifische Einstellungen prüfen
- CSS-Viewport-Einstellungen verifizieren

## Wartung und Erweiterung

### Neue Ebenen hinzufügen
1. **Asset-Konfiguration** aktualisieren
2. **Routing-Mappings** erweitern
3. **Fallback-Konfigurationen** hinzufügen

### Neue Nachrichtentypen
1. **handleIframeMessage()** erweitern
2. **HTML-Vorlagen** aktualisieren
3. **Dokumentation** aktualisieren

### Performance-Optimierung
1. **Asset-Preloading** implementieren
2. **Caching-Strategien** optimieren
3. **DOM-Manipulation** minimieren