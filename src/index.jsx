import React from 'react'
import ReactDOM from "react-dom"
import './index.css'
import Grid from './Grid';
import OpponentGrid from './OpponentGrid';


const ships = [{"name": "Porte-avion", "size": 5, "emo": '✈️', 'hit': 0}, {"name": "Croiseur", "size": 4, "emo": '⚔️', 'hit': 0}, {"name": "Sous-Marin", "size": 3, "emo": '⚜️', 'hit': 0}, {"name": "Torpilleur", "size": 2, "emo": '🛡️', 'hit': 0}]
const algo_ships = [{"name": "Porte-avion", "size": 5, "emo": '🛩️'}, {"name": "Croiseur", "size": 4, "emo": '⚔️'}, {"name": "Sous-Marin", "size": 3, "emo": '🏴'}, {"name": "Torpilleur", "size": 2, "emo": '🗡️'}]
const your_emos = ['⚔️', '✈️', '🛡️', '⚜️']
const algo_emos = ['🏴', '🗡️', '🛩️', '⚔️']
const strike_emo = '💥'
const sunk_emo = '☠️'


class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            grid: [],
            opponent_grid: []
        }
        this.rerenderParentCallback = this.rerenderParentCallback.bind(this);
      }
    
      rerenderParentCallback() {
        this.forceUpdate();
      }    
    

    GenerateGrid = (size) => {
        let tab = []
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
            tab.push({id: [i, j], valeur: null, display: null})
            }
        }
        return tab
    }

    Random_ship_place = (tab, n, ship, r, count) => {
        let dir = ['h', 'v']
        let random_dir_i = Math.floor(Math.random() * dir.length)
        let random_dir = dir[random_dir_i]
        let licht_r = []
        let licht_tab_index = []
        let tab_index = ''

        while (n < 50) {
            let random_place_i = Math.floor(Math.random() * tab.length);
            n++;
            r.push(tab[random_place_i]);
        }

        console.log("ship emo:", ship.emo)
        console.log("DIRECTION:", random_dir)

        if (random_dir === 'h') {
            for (let i=0; i < r.length; i++) {
                if (r[i].id[1] <=  (10 - ship.size)) {
                    licht_r.push(r[i]);
                    }
                }
            // console.log("R:", licht_r)

            for (let i=0; i < licht_r.length; i++) {
                licht_tab_index.push(licht_r[i].id[0]*10 + licht_r[i].id[1])
            }

            for (let j=0; j < licht_tab_index.length; j++) {
                for (let i=0; i < ship.size; i++) {
                    if (tab[licht_tab_index[j] + i].valeur === null) {
                        count +=1
                    }
                    
                    }
                    if (count === ship.size) {
                        tab_index = licht_tab_index[j]
                        break
                };
            // console.log("count:", count);
            count = 0;
            if (tab_index) {
                break
            }
            }
            // console.log("ship size:", ship.size)
            // console.log("tab_index:", tab_index)

            for (let i=0; i < ship.size; i++) {
                tab[tab_index + i].valeur = ship.emo;
                tab[tab_index + i].display = ship.emo
            }
        }
    
        else {
            for (let i=0; i < r.length; i++) {
                if (r[i].id[0] <=  (10 - ship.size)) {
                    licht_r.push(r[i]);
                    }
                }
            console.log("R:", licht_r)

            for (let i=0; i < licht_r.length; i++) {
                licht_tab_index.push(licht_r[i].id[0]*10 + licht_r[i].id[1])
            }

            for (let j=0; j < licht_tab_index.length; j++) {
                for (let i=0; i < ship.size; i++) {
                    if (tab[licht_tab_index[j] + (10*i)].valeur === null) {
                        count +=1
                    }
                   
                    }
                    if (count === ship.size) {
                        tab_index = licht_tab_index[j]
                        break
                };
            // console.log("count:", count)
            count = 0;
            if (tab_index) {
                break
            }
            }

            // console.log("ship size:", ship.size)
            // console.log("tab_index:", tab_index)

            for (let i=0; i < ship.size; i++) {
                tab[tab_index + (i*10)].valeur = ship.emo
                tab[tab_index + (i*10)].display = ship.emo
            }
        }

    return tab
}


    MakeOpponentGrid = (size) => {
        let tab = this.GenerateGrid(size)
        let n = 0;
        let random_place = [];
        for (let i=0; i < algo_ships.length; i++) {
            let count = 0
            tab = this.Random_ship_place(tab, n, algo_ships[i], random_place, count);
        }
        return tab
    }


    componentDidMount() {
        const size_grid = 10
        this.setState({
            grid: this.GenerateGrid(size_grid),
            opponent_grid: this.MakeOpponentGrid(size_grid),
        })
    }


    render() {
        return (  
            <>
            <h2>Bataille navale</h2>
                <div id='aside'>
                <React.StrictMode>
                    <div>
                        <Grid id={0} grid={this.state.grid} display={this.Display_opp_grid} />
                    </div>
                    <div id="opp-grid">
                        <OpponentGrid id={1} grid={this.state.opponent_grid} your_grid={this.state.grid} rerenderParentCallback={this.rerenderParentCallback} />
                    </div>
                </React.StrictMode>
                </div>
            </>
        )
      
}}

// const container = document.getElementById('root')

ReactDOM.render(<App />, document.getElementById('root'))

