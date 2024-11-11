import {Box, Text} from "grommet";
import ManualSection from "#app/Manual/ManualSection.jsx";


const Manual = () => {
    return (
        <Box direction={'column'}>
            <Text as={'h1'} size="xxlarge" >Manual del Smart Open Space</Text>

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
    )
}

export default Manual;
