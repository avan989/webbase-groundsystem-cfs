import EventsDisplay from './components/EventsDisplay';
import SideBar from './components/SideBar';
import Setting from './components/Setting';
import AppBar from './components/AppBar';
import Grid from '@material-ui/core/Grid';
import "./styles/app.css";
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import React from 'react';
import { useSelector, useDispatch} from "react-redux";
import {initStateInter} from "./types/types"

function App() {
    const dispatch = useDispatch();

    const socket: any = useSelector((state: initStateInter) => {
        return state.websocket
    })

   socket.onopen = () => {
        dispatch({
            type: "Add Message",
            message: "Opening Web Socket Connection"
        })
    }

    socket.onmessage = (event: any) => {
        const data = JSON.parse(event.data)
        dispatch({
            type: "Add Message",
            message: data.message
        })
    }

  return (
      <BrowserRouter>
        <div className="App">
          <div className="GridContainer" >
            <Grid container spacing={0}>
                <Grid className="SideBarGrid" item md={2}>
                  <SideBar />
                </Grid>

                <Grid className="EventGrid" item md={10}>
                  <Grid item md={12}>
                      <AppBar />
                  </Grid>
                  <Routes>
                    <Route path="/setting" element={<Setting />} />
                    <Route path="/" element={<EventsDisplay />} />
                  </Routes>
                </Grid>

            </Grid>
          </div>

          <h1 className="ScreenText"> Make Screen Bigger </h1>
        </div>
      </BrowserRouter>
    
  );
}

export default App;
