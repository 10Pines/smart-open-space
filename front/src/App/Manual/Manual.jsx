import {Anchor, Box, Button, Heading, Text} from "grommet";
import ManualSection from "#app/Manual/ManualSection.jsx";
import {ManualIcon} from "#shared/icons.jsx";
import {useEffect, useState} from "react";


const Manual = () => {
  const [activeSection, setActiveSection] = useState(null);

  useEffect(() => {
    const sections = document.querySelectorAll('#ejes-tematicos, #salas, #grilla-horaria, #slot-charla, #slot-miscelaneo');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, {
      threshold: 0.5
    });

    sections.forEach(section => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (event, sectionId) => {
    event.preventDefault();
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  return (
      <Box direction={'column'} justify={'center'} alignItems={'center'}>
        <Box direction={'row'} >
          <Text as={'h1'} size="xxlarge">Manual del Smart Open Space</Text>
          <Button icon={<ManualIcon size="medium" color="black" style={{paddingTop: '3px'}}/>} disabled/>
        </Box>

        <Box direction={"row"} gap={'small'}>
          <Box
            width="30%"
            pad="small"
            background="light-2"
            border={{ side: 'right', color: 'light-4' }}
            style={{ borderRadius: '10px', position: 'sticky', height: '80vh', top: '20px' }}
          >
            <Heading level={3}>Índice</Heading>
            <Box direction="column" gap="small">
              <Anchor
                onClick={(e) => scrollToSection(e, 'ejes-tematicos')}
                color={activeSection === 'ejes-tematicos' ? 'dark-1' : 'dark-4'}
                label="Ejes temáticos"
              />
              <Anchor
                onClick={(e) => scrollToSection(e, 'salas')}
                color={activeSection === 'salas' ? 'dark-1' : 'dark-4'}
                label="Salas"
              />
              <Anchor
                onClick={(e) => scrollToSection(e, 'grilla-horaria')}
                color={activeSection === 'grilla-horaria' ? 'dark-1' : 'dark-4'}
                label="Grilla horaria"
              />
              <Anchor
                onClick={(e) => scrollToSection(e, 'slot-charla')}
                color={activeSection === 'slot-charla' ? 'dark-1' : 'dark-4'}
                label="Slot de charla"
              />
              <Anchor
                onClick={(e) => scrollToSection(e, 'slot-miscelaneo')}
                color={activeSection === 'slot-miscelaneo' ? 'dark-1' : 'dark-4'}
                label="Slot miscelaneo"
              />
            </Box>
          </Box>

          <Box direction={'column'} justify={'center'} alignItems={'center'}>
            <ManualSection title={"Ejes temáticos"} id={"ejes-tematicos"}>
                Los ejes temáticos son una excelente forma de organizar charlas en un evento, especialmente en conferencias donde
                se cubren múltiples aspectos o enfoques de un tema general. Ayudan a que los asistentes puedan planificar mejor su
                experiencia, eligiendo las sesiones que más les interesan según sus preferencias o necesidades. Cada eje tiene un nombre,
                una descripción y un color. Ingresa el nombre, descripción (opcional) y clickea en +
            </ManualSection>

            <ManualSection title={"Salas"} id={"salas"}>
                Las salas, físicas o virtuales, definen los espacios para las charlas y determinan cuántas pueden realizarse en paralelo.
                Ingresa el nombre, link (opcional) y clickea en +
            </ManualSection>

            <ManualSection title={"Grilla horaria"} id={"grilla-horaria"}>
                Deberás organizar las agendas horarias para cada día de la conferencia. En cada día, deberás agregar slots de charlas (espacios
                donde los speakers ofrecerán charlas en cada una de las salas) o slots misceláneos (espacios reservados para actividades que realizan
                todos los participantes, como los breaks o el marketplace del open space)
            </ManualSection>

            <ManualSection title={"Slot de charla"} id={"slot-charla"}>
                Representa un slot donde se brindarán charlas en cada uno de las salas
            </ManualSection>

            <ManualSection title={"Slot misceláneo"} id={"slot-miscelaneo"}>
                Representa un slot donde se realizará una actividad común
            </ManualSection>
          </Box>
        </Box>
      </Box>
  )
}

export default Manual;
