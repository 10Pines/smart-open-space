import {Box, Button, Text, Tip} from "grommet";
import {LinkIcon} from "#shared/icons.jsx";
import {useLocation} from "react-router-dom";
import {useState} from "react";

const ManualSection = ({title, id, children}) => {
    const location = useLocation();
    const currentUrl = `${window.location.origin}${location.pathname}`;
    const [showTooltip, setShowTooltip] = useState(false);
    const copyToClipboard = () => { navigator.clipboard.writeText(`${currentUrl}#${id}`)
        .then(() => {
        setShowTooltip(true);
        setTimeout(() => {
            setShowTooltip(false);
        }, 2000);
    })
        .catch((err) => {
            console.error('Failed to copy: ', err);
        });}

    return (
        <>
            <Box direction={'row'} align={'center'} id={id}>
              <Text as={"h2"} size="xlarge">{title}</Text>
              <Button icon={<LinkIcon />} onClick={ copyToClipboard } />
              { showTooltip &&
                <Text
                  color="white"
                  size="small"
                  style={{ backgroundColor: "#5cb85c", padding: '4px', borderRadius: '2px' }}
                >
                  Copiado!
                </Text> }
            </Box>
            <Text size="medium" style={{paddingBottom: '50px'}}>
                { children }
            </Text>
        </>
    )
}

export default ManualSection;
