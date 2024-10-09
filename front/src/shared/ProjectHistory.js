import React from 'react';
import { Layer } from 'grommet';
import logo10Pines from '#assets/10Pines-logo.svg';

const ProjectHistory = (setShow) => {
  return (
    <Layer
      onEsc={() => setShow(false)}
      onClickOutside={() => setShow(false)}
      background={'white'}
      style={{ padding: 10, overflowY: 'scroll' }}
    >
      <h1>Historia</h1>
      <p>
        Smart-open-space es una herramienta cuyo principal objetivo es gestionar
        conferencias, especialmente aquellas con formato Open Space. Ha sido desarrollada
        como una colaboración entre{' '}
        <a href="https://www.10pines.com/" target="_blank" rel="noreferrer">
          10Pines
        </a>{' '}
        y la{' '}
        <a href="https://www.unq.edu.ar/" target="_blank" rel="noreferrer">
          Universidad Nacional de Quilmes
        </a>
        . Les cuento la historia y las personas que han participado en la misma para que
        entiendan mejor.
      </p>
      <p>
        Hace algunos años, se me ocurrió que podríamos construir una herramienta para
        gestionar el marketplace de los open spaces. La tecnología{' '}
        <a
          href="https://en.wikipedia.org/wiki/Open_space_technology"
          target="_blank"
          rel="noreferrer"
        >
          Open Space
        </a>{' '}
        permite organizar conferencias autogestionadas donde las personas participantes
        ofrecen charlas y posteriormente las agendan según un cronograma de horarios y
        lugares. Le comenté la idea a algunas personas y Fernando Dodino me dijo que
        podría ser un buen proyecto para desarrollar en el trabajo final de la tecnicatura
        de la UNQ. Me puso en contacto con Augusto Conti y desarrollamos la primera
        versión en un par de meses. ¡Con un timing excelente, terminamos la herramienta
        justo al inicio de la pandemia!
      </p>
      <p>
        Durante la pandemia, un grupo de aprendices estaba evaluando proyectos a realizar
        en su tercera etapa del proceso de apprenticeship en 10Pines. Presenté una
        propuesta al equipo de mentores para ampliar esta herramienta y permitir organizar
        cualquier tipo de conferencia. Durante 4 iteraciones de una semana, Ernesto
        Álvarez, Ximena Bogado y Francisco de Grandis agregaron funcionalidades para abrir
        convocatorias de ponencias, organizar las charlas en tracks y votar las charlas.
        Como resultado logramos una aplicación que puede usarse para organizar
        conferencias con otros formatos donde los organizadores pueden seleccionar las
        charlas y agendarlas (sin tener que pasar por un Marketplace). Escribí un{' '}
        <a
          href="https://blog.10pines.com/2022/07/08/finalizacion-3ra-etapa-del-apprenticeship-smart-open-space-v2/"
          target="_blank"
          rel="noreferrer"
        >
          post
        </a>{' '}
        contando la metodología que usamos con ese equipo.
      </p>
      <p>
        Después de eso, Nahuel Varisco agregó la funcionalidad para extender la
        conferencia a varios días y para poder dar feedback.
      </p>
      <p>
        En las últimas semanas, otro estudiante de la Universidad de Quilmes, José Luis
        Cassano, se sumó con un plan para robustecer la herramienta y mejorar la
        usabilidad, lo cual también servirá para su trabajo final (que será dirigido por
        Nahuel Garbezza y Facundo Gelatti, profesores y devs de la casa).
      </p>
      <p>
        En el equipo nunca participaron personas expertas en diseño/usabilidad, pero
        recientemente Gaby Iztueta realizó un{' '}
        <a
          href="https://docs.google.com/presentation/d/1No2MoLWwitk4xd_-wtx0aCr53MALJ3A3OtxNB6jdx4o/edit#slide=id.g2b1b1d855e1_0_0"
          target="_blank"
          rel="noreferrer"
        >
          estudio
        </a>{' '}
        y una{' '}
        <a
          href="https://www.figma.com/design/T9npZjPC86jKygFJCLWYRM/mockups-SOS?node-id=0-1"
          target="_blank"
          rel="noreferrer"
        >
          propuesta
        </a>{' '}
        que, si podemos implementar, hará que la herramienta se vea mucho más profesional.
      </p>
      <p>
        La experiencia ha sido muy enriquecedora. Hemos aprendido mucho y creemos que
        logramos una herramienta que puede ser útil a las comunidades que deseen utilizar
        una aplicación digital pensada específicamente con este propósito.
      </p>
      <p>
        Por supuesto, todo el código que hemos desarrollado es{' '}
        <a
          href="https://github.com/10Pines/smart-open-space/"
          target="_blank"
          rel="noreferrer"
        >
          open source
        </a>
        . Nos encantaría que lo forkeen, adapten y mejoren. Si hicieron un fork que les
        parece que vale la pena incorporar, avísennos. ¡Y si despliegan su propia versión
        también! Pueden también subir{' '}
        <a
          href="https://github.com/10Pines/smart-open-space/issues"
          target="_blank"
          rel="noreferrer"
        >
          issues
        </a>{' '}
        que detecten.
      </p>
      <p>
        Tenemos esta versión desplegada, patrocinada por 10Pines, que pueden usar gratis.
      </p>
      <p>- Federico Zuppa</p>
      <div style={{ textAlign: 'center' }}>
        <img src={logo10Pines} width="50%" alt="10Pines Logo" />
        <img
          src="https://www.unq.edu.ar/wp-content/uploads/2022/11/LOGO-UNQ.png"
          width="50%"
          alt="UNQ logo"
        />
      </div>
    </Layer>
  );
};

export default ProjectHistory;
