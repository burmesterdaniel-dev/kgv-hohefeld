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
          Kleingartenverein Hohefeld e.V.<br/>
          Musterstraße 123<br/>
          28195 Bremen
        </p>
        
        <h3 style={{marginTop: '2rem'}}>Vertreten durch:</h3>
        <p>1. Vorsitzender: Max Mustermann<br/>2. Vorsitzende: Erika Musterfrau</p>

        <h3 style={{marginTop: '2rem'}}>Kontakt:</h3>
        <p>
          Telefon: +49 (0) 421 1234567<br/>
          E-Mail: webmaster@kgv-hohefeld.de
        </p>

        <h3 style={{marginTop: '2rem'}}>Registereintrag:</h3>
        <p>
          Eintragung im Vereinsregister.<br/>
          Registergericht: Amtsgericht Bremen<br/>
          Registernummer: VR 12345 HB
        </p>
      </div>
    </div>
  )
}
