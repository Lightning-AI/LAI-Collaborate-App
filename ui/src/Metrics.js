import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CssBaseline from '@mui/material/CssBaseline';
import GlobalStyles from '@mui/material/GlobalStyles';
import Container from '@mui/material/Container';
import { CopyBlock, dracula } from "react-code-blocks";
import { styled } from "@mui/material/styles";
import Train from './Train';
import ScrollableFeed from 'react-scrollable-feed'
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import CollaborativeLinearProgress from "./components/ProgressBar"
import Title from './components/Title'

const CardContentNoPadding = styled(CardContent)(`
  padding: 0;
  height: "100%",
  "&:last-child": {
      paddingBottom: 0
    }
  }
`);

function Progress(props) {
  return (
    <React.Fragment>
      <Paper sx={{ height: "50%", p: 2, display: 'flex', mb: 1, mt: 2, flexDirection: 'column', background: "transparent", borderRadius: 2, border: 1, borderColor: "#ffffff44", boxShadow: '0' }}>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={6}>
            <Typography variant="h5" align="left" color="text.secondary" component="p" sx={{ letterSpacing: 3 }}>
              GLOBAL PROGRESS
            </Typography>
            <Typography variant="body2" align="left" color="text.secondary" component="p" sx={{ letterSpacing: 1 }}>
              Progress for the collaborative training run.
            </Typography>
          </Grid>
        </Grid>
        <CollaborativeLinearProgress eta={props.eta} progress={props.progress} epoch={props.epoch} />
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={6}>
            <Card sx={{ p: 2, display: 'flex', mb: 1, mt: 2, flexDirection: 'column', background: "transparent", borderRadius: 2, border: 1, borderColor: "#ffffff44", boxShadow: '0' }}>
              <Title><Typography variant="h6" sx={{ color: 'white', letterSpacing: 3 }}>STATISTICS</Typography></Title>
              <Container disableGutters id="left" sx={{ display: 'flex', flexDirection: 'row',  }}>
                  <Container disableGutters sx={{pl : 0, pr: 2}}>
                    <Title><Typography variant="caption" sx={{ color: 'white' }}>GLOBAL EPOCH ETA</Typography></Title>
                    <Title><Typography variant="h5" sx={{ color: 'white' }}>{props.eta}</Typography></Title>
                  </Container>
                  <Container disableGutters sx={{pl : 0, pr: 0}}>
                    <Title><Typography variant="caption" sx={{ color: 'white' }}>NUMBER OF PEERS</Typography></Title>
                    <Title><Typography variant="h5" sx={{ color: 'white' }}>{props.peers}</Typography></Title>
                  </Container>
              </Container>
            </Card>
          </Grid>
        </Grid>
      </Paper>
    </React.Fragment>
  );
}

export default function Metrics(props) {

  const [progress, setProgress] = React.useState(0);
  const [epoch, setEpoch] = React.useState(0);
  const [peers, setPeers] = React.useState(0);
  const [eta, setEta] = React.useState('00:00:00');

  var lightningState = props.lightningState;

  React.useEffect(() => {
    if (lightningState) {
      let work_state = lightningState.flows.train_flow.works.work_0?.vars;
      if (work_state && work_state?.progress_state) {
        setProgress(work_state.progress_state.progress);
        setEpoch(work_state.progress_state.epoch);
        setEta(work_state.progress_state.eta);
        setPeers(work_state.progress_state.peers);
      }
    }
  }, [lightningState]);


  return (
    <React.Fragment>
      <Container sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h2" align="left" color="text.secondary" component="p" sx={{ ml: 1, letterSpacing: 3 }}>
          &#8203;
        </Typography>
        <Typography variant="body1" align="left" color="text.secondary" component="p" sx={{ ml: 1, letterSpacing: 1 }}>
          &#8203;
        </Typography>
        {Progress({eta, progress, epoch, peers})}
        <Card sx={{ borderRadius: 2, height: "100%" }}>
          <CardContent sx={{ p: 0, height: "100%", '&:last-child': { pb: 0 }, backgroundColor: '#282a36' }}>
            <Box sx={{ height: "300px", overflowY: "auto", width: '100%', pb: 0, backgroundColor: '#282a36' }}>
              <ScrollableFeed>
                <CopyBlock
                  text={props.logState}
                  language={"bash"}
                  showLineNumbers={false}
                  wrapLines
                  theme={dracula}
                  customStyle={{ paddingLeft: 20 }}
                />
              </ScrollableFeed>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </React.Fragment>
  )
}