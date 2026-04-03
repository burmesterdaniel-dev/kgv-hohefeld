export const metadata = {
  title: 'Datenschutzerklärung - KGV Hohefeld'
}

export default function Datenschutz() {
  return (
    <div className="max-w-4xl mx-auto px-8 mb-24 pt-8">
      <h1 className="text-4xl md:text-5xl font-headline font-extrabold text-[#00473d] mb-12 tracking-tight">Datenschutzerklärung</h1>
      
      <div className="prose prose-slate prose-lg md:prose-xl max-w-none text-slate-600">
        
        <h2>1. Datenschutz auf einen Blick</h2>
        <h3>Allgemeine Hinweise</h3>
        <p>Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können. Ausführliche Informationen zum Thema Datenschutz entnehmen Sie unserer unter diesem Text aufgeführten Datenschutzerklärung.</p>
        
        <h3>Datenerfassung auf dieser Website</h3>
        <p><strong>Wer ist verantwortlich für die Datenerfassung auf dieser Website?</strong></p>
        <p>Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Dessen Kontaktdaten können Sie dem Impressum dieser Website entnehmen.</p>
        
        <p><strong>Wie erfassen wir Ihre Daten?</strong></p>
        <p>Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese mitteilen. Hierbei kann es sich z.B. um Daten handeln, die Sie in ein Kontaktformular eingeben.</p>
        <p>Andere Daten werden automatisch beim Besuch der Website durch unsere IT-Systeme erfasst. Das sind vor allem technische Daten (z.B. Internetbrowser, Betriebssystem oder Uhrzeit des Seitenaufrufs). Die Erfassung dieser Daten erfolgt automatisch, sobald Sie diese Website betreten.</p>
        
        <p><strong>Wofür nutzen wir Ihre Daten?</strong></p>
        <p>Ein Teil der Daten wird erhoben, um eine fehlerfreie Bereitstellung der Website zu gewährleisten. Andere Daten können zur Analyse Ihres Nutzerverhaltens verwendet werden.</p>

        <hr className="my-12 border-slate-200" />

        <h2>2. Allgemeine Hinweise und Pflichtinformationen</h2>
        <h3>Datenschutz</h3>
        <p>Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Wir behandeln Ihre personenbezogenen Daten vertraulich und entsprechend der gesetzlichen Datenschutzvorschriften sowie dieser Datenschutzerklärung.</p>
        
        <h3>Hinweis zur verantwortlichen Stelle</h3>
        <p>Die verantwortliche Stelle für die Datenverarbeitung auf dieser Website ist:</p>
        <p className="bg-slate-50 p-6 rounded-xl border border-slate-100 not-prose">
          <strong>KGV-Hohe-Feld-Huchting e.V.</strong><br />
          An der Leeuwarder Sraße<br />
          28259 Bremen<br /><br />
          E-Mail: webmaster@kgv-hohefeld.de
        </p>

        <h3>SSL- bzw. TLS-Verschlüsselung</h3>
        <p>Diese Seite nutzt aus Sicherheitsgründen und zum Schutz der Übertragung vertraulicher Inhalte, wie zum Beispiel Bestellungen oder Anfragen, die Sie an uns als Seitenbetreiber senden, eine SSL- bzw. TLS-Verschlüsselung. Eine verschlüsselte Verbindung erkennen Sie daran, dass die Adresszeile des Browsers von "http://" auf "https://" wechselt und an dem Schloss-Symbol in Ihrer Browserzeile.</p>

        <hr className="my-12 border-slate-200" />

        <h2>3. Datenerfassung auf dieser Website</h2>
        <h3>Cookies</h3>
        <p>Unsere Internetseiten verwenden teilweise so genannte Cookies. Cookies richten auf Ihrem Rechner keinen Schaden an und enthalten keine Viren. Cookies dienen dazu, unser Angebot nutzerfreundlicher, effektiver und sicherer zu machen. Cookies sind kleine Textdateien, die auf Ihrem Rechner abgelegt werden und die Ihr Browser speichert.</p>
        <p>Wir verwenden ausschließlich technisch notwendige ("essenzielle") Cookies (z.B. für die Datenspeicherung Ihrer Cookie-Präferenz), deren Einsatz gesetzlich direkt gerechtfertigt ist (Art. 6 Abs. 1 lit. f DSGVO). Sie können Ihren Browser so einstellen, dass Sie über das Setzen von Cookies informiert werden und Cookies nur im Einzelfall erlauben.</p>
        
        <h3>Server-Log-Dateien</h3>
        <p>Der Provider der Seiten (Vercel Inc.) erhebt und speichert automatisch Informationen in so genannten Server-Log-Dateien, die Ihr Browser automatisch an uns übermittelt. Dies sind:</p>
        <ul>
          <li>Browsertyp und Browserversion</li>
          <li>verwendetes Betriebssystem</li>
          <li>Referrer URL</li>
          <li>Hostname des zugreifenden Rechners</li>
          <li>Uhrzeit der Serveranfrage</li>
          <li>IP-Adresse</li>
        </ul>
        <p>Eine Zusammenführung dieser Daten mit anderen Datenquellen wird nicht vorgenommen.</p>

        <h3>Kontaktformular & Datenbank</h3>
        <p>Wenn Sie uns per Kontaktformular Anfragen zukommen lassen (z.B. Pachtinteresse), werden Ihre Angaben aus dem Anfrageformular inklusive der von Ihnen dort angegebenen Kontaktdaten zwecks Bearbeitung der Anfrage und für den Fall von Anschlussfragen bei uns gespeichert. Diese Daten werden in unserer verschlüsselten SQLite-Datenbank hinterlegt und ohne Ihre Einwilligung nicht weitergegeben.</p>
        
        <hr className="my-12 border-slate-200" />

        <h2>4. Plugins und Tools</h2>
        <h3>Vercel Web Analytics</h3>
        <p>Diese Website nutzt <strong>Vercel Web Analytics</strong> (ein Dienst von Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, USA) um die Seitenaufrufe und Performance unserer Website zu analysieren. Dabei arbeitet Vercel Analytics äußerst datenschutzfreundlich: Es werden <strong>keine personenbezogenen Daten</strong> gespeichert und <strong>keine Tracking-Cookies</strong> auf Ihrem Gerät abgelegt. Auch die IP-Adresse wird anonymisiert, weshalb keine direkte Rückverfolgbarkeit zu Ihnen möglich ist. Diese rein statistische und pseudonymisierte Verarbeitung erfolgt gemäß Art. 6 Abs. 1 lit. f DSGVO zur Wahrung unseres berechtigten Interesses an einem performanten und sicheren Web-Angebot.</p>

        <h3>Google Fonts (lokal)</h3>
        <p>Diese Seite nutzt zur einheitlichen Darstellung von Schriftarten so genannte Web Fonts (Plus Jakarta Sans und Manrope). Diese werden durch das Next.js Framework lokal gehostet bzw. optimiert geladen, sodass keine Verbindung zu Google-Servern beim Aufruf der Seite aufgebaut wird. Es werden keine IP-Adressen an externe Schriftartanbieter übertragen.</p>

      </div>
    </div>
  )
}
