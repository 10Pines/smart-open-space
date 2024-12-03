import {Anchor, Box, Button, Heading, Text} from "grommet";
import ManualSection from "#app/Manual/ManualSection.jsx";
import {ManualIcon} from "#shared/icons.jsx";
import {useEffect, useState} from "react";
import useSize from "#helpers/useSize.jsx";
import {scrollToSection} from "#helpers/scrollUtils.js";


const Manual = () => {
  const [activeSection, setActiveSection] = useState(null);
  const size = useSize();
  const subSections = {
    "ejes-tematicos": "Ejes temáticos",
    "salas": "Salas",
    "grilla-horaria": "Grilla horaria",
    "slot-charla": "Slot charla",
    "slot-miscelaneo": "Slot miscelaneo",
  }

  useEffect(() => {
    const sections = document.querySelectorAll(Object.keys(subSections).map(key => `#${key}`).join(", "));
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

  return (
      <Box direction={'column'} justify={'center'} alignItems={'center'}>
        <Box direction={'row'} >
          <Text as={'h1'} size="xxlarge">Manual del Smart Open Space</Text>
          <Button icon={<ManualIcon size="medium" color="black" style={{paddingTop: '3px'}}/>} disabled/>
        </Box>

        <Box direction={"row"} gap={'small'}>
          {size !== "small" &&
            <Box
              width="30%"
              pad="small"
              background="light-2"
              border={{ side: 'right', color: 'light-4' }}
              style={{ borderRadius: '10px', position: 'sticky', height: '80vh', top: '20px', minWidth: '10rem' }}
            >
            <Heading level={3}>Índice</Heading>
            <Box direction="column" gap="small">
              { Object.entries(subSections).map(([section, label]) => (
                <Anchor
                  onClick={(e) => scrollToSection(e, section)}
                  color={activeSection === section ? 'dark-1' : 'dark-4'}
                  label={label}
                />
              ))}
            </Box>
          </Box>}
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
