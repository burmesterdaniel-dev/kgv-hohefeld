export const metadata = {
  title: 'Impressum - KGV Hohefeld'
}

export default function Impressum() {
  return (
    <div className="max-w-7xl mx-auto px-8 mb-24" style={{paddingTop: '2rem'}}>
      <h1 className="fade-in">Impressum</h1>
      
      <div className="fade-in" style={{
        padding: '2rem',
        background: 'var(--color-bremen-white)',
        borderRadius: '12px',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <h3>Angaben gemäß § 5 TMG</h3>
        <p>
          KGV-Hohe-Feld-Huchting e.V.<br/>
          An der Leeuwarder Straße<br/>
          28259 Bremen
        </p>
        
        <h3 style={{marginTop: '2rem'}}>Vertreten durch den Vorstand:</h3>
        <p>
          1. Vorsitzender: Zoltan Wellbrock<br/>
          2. Vorsitzende: Valentina Fuks<br/>
          1. Kassiererin: Valentina Tebelius<br/>
          1. Schriftführerin: Anna Fusikova<br/>
          2. Schriftführerin: Britta Schulze
        </p>

        <h3 style={{marginTop: '2rem'}}>Kontakt:</h3>
        <p>
          Telefon: +49 (0) 421 1234567<br/>
          E-Mail: webmaster@kgv-hohefeld.de
        </p>

        <h3 style={{marginTop: '2rem'}}>Registereintrag:</h3>
        <p>
          Eintragung im Vereinsregister.<br/>
          Registergericht: Amtsgericht Bremen<br/>
          Registernummer: VR 3259 HB
        </p>
      </div>
    </div>
  )
}
