import React from 'react'
import ReactDOM from "react-dom"
import './index.css'
import Grid from './Grid';
import OpponentGrid from './OpponentGrid';
import { algo_ships } from './Ships'

let app_gh_pages_URL = "https://pierre605.github.io/Battleship-ReactJS-/";

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


    componentDidMount() {
        const size_grid = 10
        this.setState({
            grid: this.GenerateGrid(size_grid),
            opponent_grid: this.MakeOpponentGrid(size_grid),
            })
        }

    ResetGame() {
        const size_grid = 10
        this.setState({
            grid: this.GenerateGrid(size_grid),
            opponent_grid: this.MakeOpponentGrid(size_grid),
        })
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
                count = 0;
                
                if (tab_index) {
                    break
                }
            }

            for (let i=0; i < ship.size; i++) {
                tab[tab_index + i].valeur = ship.emo;
                // tab[tab_index + i].display = ship.emo
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

            count = 0;
            if (tab_index) {
                break
            }
            }

            for (let i=0; i < ship.size; i++) {
                tab[tab_index + (i*10)].valeur = ship.emo
                // tab[tab_index + (i*10)].display = ship.emo
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


    render() {
        return (  
            <>
            <h2 className='title'>BATAILLE NAVALE</h2>
                <div id='grids'>
                <React.StrictMode>
                    <div>
                        <Grid id={0} grid={this.state.grid} display={this.Display_opp_grid} />
                    </div>
                    <div id='center'>
                        <img id="vs" src={app_gh_pages_URL + "vs.png"} alt='versus'/>

                        <div id="Modal-victory" class="modal">
                            <div class="modal-content">
                                <span class="close"></span>
                                <p>Victoire ! Vous avez coulé tous les navires ennemis 🥳</p>
                                <img id="vic-pic" alt="victory" src={app_gh_pages_URL + 'victory_pic.png'} />
                            </div>
                        </div>
                        <div id="Modal-defeat" class="modal">
                            <div class="modal-content">
                                <span class="close"></span>
                                <p>Défaite. Tous vos navires ont été coulé 🥴</p>
                                <img id="loose-pic" alt="defeat" src={app_gh_pages_URL + 'defeat_pic.png'} />
                            </div>
                        </div>
                        <div id="info">
                            <div id='info-your-grid'></div>
                            <div id='info-algo-grid'></div>
                        </div>
                    </div>
                    <div id="opp-grid">
                        <OpponentGrid id={1} grid={this.state.opponent_grid} your_grid={this.state.grid} rerenderParentCallback={this.rerenderParentCallback} reset={this.MakeOpponentGrid} />
                    </div>
                </React.StrictMode>
                </div>
                <div id="ships-pics">
                    <div id="ships-group">
                        <img alt="ship" width="14%" src={app_gh_pages_URL + 'bs_ship_pic.png'}/>
                        <img alt="ship" width="14%" src={app_gh_pages_URL + 'bs_ship_pic_reverse.png'}/>
                    </div>
                    <div id="subs-group">
                        <img alt="submarine" width="14%" src={app_gh_pages_URL + 'bs_sub_pic_signed.png'}/>
                        <img alt="submarine" width="14%" src={app_gh_pages_URL + 'bs_sub_pic_reverse.png'}/>
                    </div>
                </div>
            </>
        )
      
}}

// const container = document.getElementById('root')

ReactDOM.render(<App />, document.getElementById('root'))

