import React from 'react';
import Radium from 'radium';
import { Row, Cell } from '../components/Grid';
import styleVariables from '../components/styleVariables';

export default ({content}) => {
  let blocks = null;
  let collumns = null;
  if(content) blocks = content.band.map(Block)
  if(content) collumns = content.masonry.map(Collumn)

  return (
    <div>
      <Row style={style.band}> {blocks} </Row>
      <Row style={style.masonry}> {collumns} </Row>
    </div>
  )
}

const Block = ({title, description}) => {
  return (
    <Cell style={style.block} md={4}>
      <h2 style={style.heading}>{title}</h2>
      <p style={style.paragraph}>{description}</p>
    </Cell>
  )
}

const Collumn = (blocks) => {
  let items = blocks.map(({title, description}) => {
    return (
      <div style={style.block}>
        <h2 style={style.heading}>{title}</h2>
        <p style={style.paragraph}>{description}</p>
      </div>
    )
  })

  return (<Cell md={4}>{items}</Cell>)
}

const rows = {
  band: [
    {
      title: "Hvad er Mæcen.com?",
      description: `Vi er en platform, der giver dig mulighed for at få støtte
      af mæcener, som en månedlig indtægt til at producere det indhold, som du
      selv ønsker at skabe. Uden noget som helst andet.`,
    },
    {
      title: 'HVAD ER EN MÆCEN?',
      description: `Mæcen er oprindeligt en person der støtter kunst og
      videnskab økonomisk. For os er en mæcen en som ønsker at støtte et
      mæcenat, fordi hun ønsker at give tilbage for det hun får.`,
    },
    {
      title: 'HVAD ER ET MÆCENAT?',
      description: `Et Mæcenat består af en præsentation, som alle kan se, og en
      indholdsside med tekster, billeder og videoer som man kun kan få
      adgang til hvis man abonnerer, og dermed bliver Mæcen`,
    }
  ],
  masonry: [
    [
      {
        title: 'Co-operativ platform',
        description: `Mæcen.com er ejet og drevet af andelsselskabet DiGiDi
        a.m.b.a. Alle de mere end 3.500 andelshavere har én andel hver og én
        stemme.Der er ingen investorer, stiftere eller andre kapitalinteresser i
        projektet.`
      },
      {
        title: 'Ægte deleøkonomi',
        description: `Da der ikke er enkeltpersoner, virksomheder eller investorer
         der ejer Mæcen.net projektet er der tale om ægte deleøkonomi (I
        modsætning til fx AirBnB og Uber). Alle indtægter går derfor ubeskåret
        til at drive og forbedre platformen eller til at nedsætte betalingen for
        brugen. Det er brugerne af platformen der skal tjene pengene, ikke ejerne.`
      },
      {
        title: 'Reklamefri',
        description: `Mæcen er uden reklamer og annoncer. Det er ikke muligt at
        annoncere på Mæcen.net. Hvis du opretter et Mæcenat, er det op til dig om
        du vil have reklamer og sponsorater på din indholdsside.`
      },
    ],[
      {
        title: 'Free speech',
        description: `På Mæcen er der ingen censur eller filtrering, så længe
        indholdet lever op til den danske lovgivning, der er en af de mest åbne,
        hvad angår ytringsfrihed. Ved at betale direkte til de der skrive
        indholdet, kan man også udgå den form for censur, eller filtrering, der
        almindeligvis finder sted i medierne. Det kan være at indholdet filtreres
        efter en redaktionel linje eller af hensynet til sponsorer, annoncører
        eller andre økonomiske interesser. Ved at betale direkte til den skabende,
        uanset om det er en journalist eller et band, kan man sikre, at netop dem
        man støtter, forsat har mulighed for at udtrykke sig på deres helt egen
        måde.`
      },
      {
        title: 'Free flow',
        description: `Free Flow er princippet om at reducere leddene imellem
        leverandør og aftager. Det kan enten være økonomiske 'mellemmænd' eller
        instanser der udøver en eller anden form for filtrering eller censur.
        Når du støtter et Mæcenat, går din betaling direkte til den der har skabt
         Mæcenatet. Mæcen.net projektet tager en fast betaling pr. mæcen pr måned.
        Lige nu er det beløb 1kr pr måned. Men jo flere der anvender Mæcen.net
        des lavere bliver dette beløb.Formålet med Mæcen.net er jo netop at
        udbetale så meget som muligt til de der levere indholdet.`
      },
    ],[
      {
        title: 'Fuld beskyttelse af private data',
        description: `Mæcen videregiver eller sælger ikke information om brugerne
        eller brugeradfærd til 3. part. Der lavers heller ikke nogen form for
        analyser på grundlag af de informationer du afgiver om dig selv, eller din
        adfærd på Mæcen.net. Du vil altså ikke opleve af få information om at
        'Brugere der har støttet dette Mæcenat, også har støttet et andet Mæcenat'
         osv., ligesom man ikke kan se hvor mange og hvilke brugere der støtter de
        enkelte Mæcenater.`
      },
      {
        title: 'Open Source',
        description: `Mæcen er programmeret på en Open Source platform. Hvis du er
         interesseret i at blive koblet til udviklerteamet, og hjælpe med at
        videreudvikle Mæcen, er du mere end velkommen til at kontakte:
        maecen@digidi.dk`
      },
    ]
  ]
}

const style = {
  masonry: {
    marginTop: '2rem'
  },
  band: {
    backgroundColor: styleVariables.color.primary,
    color: styleVariables.color.white,
    marginTop: '5rem',
  },
  block: {
    textAlign: 'left',
    padding: '1rem 2rem',
    lineHeight: '1.5rem',
  },
  heading: {
    textTransform: 'uppercase'
  },
  paragraph: {
    marginTop: '1rem',
  }
}
