import React from 'react'
import './Grid.css'
import { algo_ships, ships, your_emos } from './Ships'



class OpponentGrid extends React.Component {
    constructor (props) {
        super (props);
        this.state = {
            opponent_grid: this.props.grid,
            your_grid: this.props.your_grid,
            coord_hit: '',
            score_opponent: 0,
            score_you: 0
        }
    this.onBtnClick = this.onBtnClick.bind(this);
    this.Reset = this.Reset.bind(this);
    }

    onBtnClick() {
        this.props.rerenderParentCallback();
    }

    Reset() {
        this.props.reset()
        console.log("Reset")
    }


    componentDidMount() {
        this.setState({ 
            opponent_grid: this.props.grid,
            your_grid: this.props.your_grid,
            coord_hit: [],
        });
    }

    DisplayAlgoShootReport = (text) => {
        let info = document.getElementById("info-your-grid")
        info.textContent = text;
        let hit_sound = document.getElementById("hit-sound")
        hit_sound.volume = 0.7;
        let sunk_sound = document.getElementById("sunk-sound")
        sunk_sound.volume = 0.7;

        if (text) {
            if (text.includes('est coulé 😵')) {
                sunk_sound.play()
            }
            else {
            hit_sound.play()
            }
        }

        setTimeout(() => {
            text = '';
            info.textContent = text
        }, 1500)
    }

    DisplayYourShootReport = (text) => {
        let info = document.getElementById("info-algo-grid")
        info.textContent = text;
        let hit_sound = document.getElementById("hit-sound")
        hit_sound.volume = 0.7;
        let sunk_sound = document.getElementById("sunk-sound")
        sunk_sound.volume = 0.7;

        if (text.includes('ennemi coulé 💯')) {
            sunk_sound.play()
        }
        else {
        hit_sound.play()
        }

        setTimeout(() => {
            text = '';
            info.textContent = text
        }, 1500)
    }

    DisplayScore = () => {
        let score = document.getElementsByClassName("score")
        for (const div of score) {
            div.innerHTML = `<br/>Score<br/>Vous: <b>${this.state.score_you}</b><br/>Automate: <b>${this.state.score_opponent}</b>`
        }
    }

    ResetShipsHealth = () => {
        for (let i=0; i < ships.length; i++) {
            ships[i].hit = 0;
            algo_ships[i].hit = 0;
        }
    }

    On_Trigger = (cell_id) => {
        let grid = this.props.grid;
        let index = cell_id[0]*10 + cell_id[1];
        let text = '';

        if (grid[index].valeur === null) {
            grid[index].display = '🌀';
            // text = "Manqué !"
            }
        else if (grid[index].display in ['🌀', '💥']) {
            text = ''
        }
        else {
            for (const ship of algo_ships) {
                if ((grid[index].valeur === ship.emo) && (grid[index].display !== '☠️') && (grid[index].display !== '💥')) {
                    grid[index].display = '💥'
                    ship.hit += 1
                    console.log(`${ship.hit} hit`)
                    console.log(`${ship.name} ennemi touché`)
                    text = `${ship.name} ennemi touché 🎯`

                    let sunk_text = this.Check_sunk_algo(grid, ship)
                    if (sunk_text) {
                        text = sunk_text
                    }
                    this.Check_defeat_algo(grid)
                    this.DisplayYourShootReport(text);
                }
            }
        }
        this.setState({
            opponent_grid: grid,
        })

        setTimeout(() => {this.Algo_player()}, 400)
    }


    Algo_player = () => {
        let grid = this.props.your_grid;
        let algo_grid = this.props.grid;
        let n = 0;
        let r = [];
        let r_idx = [];
        let available = [];
        let count_strike = 0;
        let count_miss = 0;
        let coord_strike = [];
        let coord_hit = this.state.coord_hit;
        let text = '';
        
        for (let i=0; i < grid.length; i++) {
            if ((grid[i].display === '💥')) {
                coord_strike.push(grid[i].id[0]*10 + grid[i].id[1])
                count_strike += 1
            }
            if ((grid[i].display === '🌀')) {
                count_miss += 1
            }
        }
        console.log("count strike:", count_strike)
        console.log("count miss:", count_miss)

        
        if (count_strike === 0) {
            coord_hit = []
            console.log("coord_hit:", coord_hit)
    
            for (let i=0; i < grid.length; i++) {
                if ((grid[i].display === null) || (your_emos.includes(grid[i].display))) { 
                    available.push(grid[i])
                }
            }
            console.log("available_list:", available)
    
            while (n < available.length * 10) {
                let random_place_i = Math.floor(Math.random() * available.length);
                n++;
                if (r.includes(available[random_place_i]) === false) {
                    r.push(available[random_place_i]);
                }
            }

            for (let i=0; i < r.length; i++) {
                r_idx.push(r[i].id[0]*10 + r[i].id[1])
            }
    
            for (let i=0; i < r_idx.length; i++) {
                for (const ship of ships) {
                    if (grid[r_idx[i]].valeur === ship.emo) {
                        grid[r_idx[i]].display = '💥'
                        ship.hit += 1
                        console.log(`${ship.hit} hit`)
                        console.log(`Votre ${ship.name} est touché`)
                        text = `Votre ${ship.name} est touché 🤕`
                        coord_hit.push(r_idx[i])
                        break
                    }
                    
                    else if (grid[r_idx[i]].valeur === null) {

                        // fully null surrounded avoid
                        if (available.length > 20) {
                            // middle
                            if ((grid[r_idx[i]].id[0] > 0) && (grid[r_idx[i]].id[0] < 9) && (grid[r_idx[i]].id[1] > 0) && (grid[r_idx[i]].id[1] < 9)) {
                                if ((['🌀', '☠️'].includes(grid[r_idx[i] + 10].display)) && ['🌀', '☠️'].includes(grid[r_idx[i] - 10].display) && ['🌀', '☠️'].includes(grid[r_idx[i] + 1].display) && ['🌀', '☠️'].includes(grid[r_idx[i] - 1].display)) {
                                    console.log("USELESS SHOOT:", grid[r_idx[i]].id);
                                    i++;
                                    // console.log("Iteration UU :", i)
                                    console.log("grid[r_idx[i]].id UU :", grid[r_idx[i]].id)
                                }
                                else {
                                    grid[r_idx[i]].display = '🌀';
                                    break
                                }
                            }
                            // top left corner
                            else if ((grid[r_idx[i]].id[0] === 0) && (grid[r_idx[i]].id[1] === 0)) {
                                if ((['🌀', '☠️'].includes(grid[r_idx[i] + 10].display)) && ['🌀', '☠️'].includes(grid[r_idx[i] + 1].display)) {
                                    console.log("USELESS SHOOT:", grid[r_idx[i]].id);
                                    i++;
                                    // console.log("Iteration UU :", i)
                                    console.log("grid[r_idx[i]].id UU :", grid[r_idx[i]].id)
                                }
                                else {
                                    grid[r_idx[i]].display = '🌀';
                                    break
                                }
                            }
                            // top right corner
                            else if ((grid[r_idx[i]].id[0] === 0) && (grid[r_idx[i]].id[1] === 9)) {
                                if ((['🌀', '☠️'].includes(grid[r_idx[i] + 10].display)) && ['🌀', '☠️'].includes(grid[r_idx[i] - 1].display)) {
                                    console.log("USELESS SHOOT:", grid[r_idx[i]].id);
                                    i++;
                                    // console.log("Iteration UU :", i)
                                    console.log("grid[r_idx[i]].id UU :", grid[r_idx[i]].id)
                                }
                                else {
                                    grid[r_idx[i]].display = '🌀';
                                    break
                                }
                            }
                            // down left corner
                            else if ((grid[r_idx[i]].id[0] === 9) && (grid[r_idx[i]].id[1] === 0)) {
                                if ((['🌀', '☠️'].includes(grid[r_idx[i] - 10].display)) && ['🌀', '☠️'].includes(grid[r_idx[i] + 1].display)) {
                                    console.log("USELESS SHOOT:", grid[r_idx[i]].id);
                                    i++;
                                    // console.log("Iteration UU :", i)
                                    console.log("grid[r_idx[i]].id UU :", grid[r_idx[i]].id)
                                }
                                else {
                                    grid[r_idx[i]].display = '🌀';
                                    break
                                }
                            }
                            // down right corner
                            else if ((grid[r_idx[i]].id[0] === 9) && (grid[r_idx[i]].id[1] === 9)) {
                                if ((['🌀', '☠️'].includes(grid[r_idx[i] - 10].display)) && ['🌀', '☠️'].includes(grid[r_idx[i] - 1].display)) {
                                    console.log("USELESS SHOOT:", grid[r_idx[i]].id);
                                    i++;
                                    // console.log("Iteration UU :", i)
                                    console.log("grid[r_idx[i]].id UU :", grid[r_idx[i]].id)
                                }
                                else {
                                    grid[r_idx[i]].display = '🌀';
                                    break
                                }
                            }
                            // top edge
                            else if (grid[r_idx[i]].id[0] === 0) {
                                if ((['🌀', '☠️'].includes(grid[r_idx[i] + 10].display)) && ['🌀', '☠️'].includes(grid[r_idx[i] + 1].display) && ['🌀', '☠️'].includes(grid[r_idx[i] - 1].display)) {
                                    console.log("USELESS SHOOT:", grid[r_idx[i]].id);
                                    i++;
                                    // console.log("Iteration UU :", i)
                                    console.log("grid[r_idx[i]].id UU :", grid[r_idx[i]].id)
                                }
                                else {
                                    grid[r_idx[i]].display = '🌀';
                                    break
                                }
                            }
                            // down edge
                            else if (grid[r_idx[i]].id[0] === 9) {
                                if ((['🌀', '☠️'].includes(grid[r_idx[i] - 10].display)) && ['🌀', '☠️'].includes(grid[r_idx[i] + 1].display) && ['🌀', '☠️'].includes(grid[r_idx[i] - 1].display)) {
                                    console.log("USELESS SHOOT:", grid[r_idx[i]].id);
                                    i++;
                                    // console.log("Iteration UU :", i)
                                    console.log("grid[r_idx[i]].id UU :", grid[r_idx[i]].id)
                                }
                                else {
                                    grid[r_idx[i]].display = '🌀';
                                    break
                                }
                            }
                            // left edge
                            else if (grid[r_idx[i]].id[1] === 0) {
                                if ((['🌀', '☠️'].includes(grid[r_idx[i] + 10].display)) && ['🌀', '☠️'].includes(grid[r_idx[i] - 10].display) && ['🌀', '☠️'].includes(grid[r_idx[i] + 1].display)) {
                                    console.log("USELESS SHOOT:", grid[r_idx[i]].id);
                                    i++;
                                    // console.log("Iteration UU :", i)
                                    console.log("grid[r_idx[i]].id UU :", grid[r_idx[i]].id)
                                }
                                else {
                                    grid[r_idx[i]].display = '🌀';
                                    break
                                }
                            }
                            // right edge
                            else if (grid[r_idx[i]].id[1] === 9) {
                                if ((['🌀', '☠️'].includes(grid[r_idx[i] + 10].display)) && ['🌀', '☠️'].includes(grid[r_idx[i] - 10].display) && ['🌀', '☠️'].includes(grid[r_idx[i] - 1].display)) {
                                    console.log("USELESS SHOOT:", grid[r_idx[i]].id);
                                    i++;
                                    // console.log("Iteration UU :", i)
                                    console.log("grid[r_idx[i]].id UU :", grid[r_idx[i]].id)
                                }
                                else {
                                    grid[r_idx[i]].display = '🌀';
                                    break
                                }
                            }
                    }
                    else {
                        grid[r_idx[i]].display = '🌀'
                        break
                    }
                }
            }  break
        }
    }
        
        else if (count_strike === 1)  {
            let i = coord_hit[coord_hit.length - 1]
            // console.log("coord_hit_ref:", i)
            // console.log("coord_strike:", coord_strike)

            for (const ship of ships) {
                // Vertical
                if ((grid[i].id[0] > 0) && (grid[i].id[0] < 9))   {
                    if ((grid[i + 10].display !== '🌀') && (grid[i + 10].display !== '☠️')) {
                        if (grid[i +10].valeur === ship.emo) {
                            ship.hit += 1
                            console.log(`${ship.hit} hit`)
                            console.log(`Votre ${ship.name} est touché`)
                            text = `Votre ${ship.name} est touché 🤕`
                            grid[i +10].display = '💥'
                            coord_hit.push(i + 10)
                            let sunk = this.Check_sunk_you(grid, ship, coord_hit)
                            if (sunk) {
                                text = sunk[0];
                                coord_hit = sunk[1]
                            }
                            break
                        }
                        else if (grid[i +10].display === null) {
                            grid[i +10].display = '🌀'
                            break
                        }
                    }
                    else if ((grid[i - 10].display !== '🌀') && (grid[i - 10].display !== '☠️')) {
                        if (grid[i - 10].valeur === ship.emo) {
                            ship.hit += 1
                            console.log(`${ship.hit} hit`)
                            console.log(`Votre ${ship.name} est touché`)
                            text = `Votre ${ship.name} est touché 🤕`
                            grid[i - 10].display = '💥'
                            coord_hit.push(i - 10)
                            let sunk = this.Check_sunk_you(grid, ship, coord_hit)
                            if (sunk) {
                                text = sunk[0];
                                coord_hit = sunk[1]
                            }
                            break
                        }
                        else if (grid[i - 10].display === null) {
                            grid[i - 10].display = '🌀'
                            break
                        }
                    }
                }

                else if (grid[i].id[0] === 0) {
                    if ((grid[i + 10].display !== '🌀') && (grid[i + 10].display !== '☠️')) {
                        if (grid[i + 10].valeur === ship.emo) {
                            ship.hit += 1
                            console.log(`${ship.hit} hit`)
                            console.log(`Votre ${ship.name} est touché`)
                            text = `Votre ${ship.name} est touché 🤕`
                            grid[i + 10].display = '💥'
                            coord_hit.push(i + 10)
                            let sunk = this.Check_sunk_you(grid, ship, coord_hit)
                            if (sunk) {
                                text = sunk[0];
                                coord_hit = sunk[1]
                            }
                            break
                        }
                        else if (grid[i + 10].display === null) {
                            grid[i + 10].display = '🌀'
                            break
                        }
                    }
                }
                
                else if (grid[i].id[0] === 9) {
                    if ((grid[i - 10].display !== '🌀') && (grid[i - 10].display !== '☠️')) {
                        if (grid[i - 10].valeur === ship.emo) {
                            ship.hit += 1
                            console.log(`${ship.hit} hit`)
                            console.log(`Votre ${ship.name} est touché`)
                            text = `Votre ${ship.name} est touché 🤕`
                            grid[i - 10].display = '💥'
                            coord_hit.push(i - 10)
                            let sunk = this.Check_sunk_you(grid, ship, coord_hit)
                            if (sunk) {
                                text = sunk[0];
                                coord_hit = sunk[1]
                            }
                            break
                        }
                        else if (grid[i - 10].display === null) {
                            grid[i - 10].display = '🌀'
                            break
                        }
                    }
                }
                
                // Horizontal
                if ((grid[i].id[1] > 0) && (grid[i].id[1] < 9)) {
                    if ((grid[i + 1].display !== '🌀') && (grid[i + 1].display !== '☠️')) {
                        if (grid[i + 1].valeur === ship.emo) {
                            ship.hit += 1
                            console.log(`${ship.hit} hit`)
                            console.log(`Votre ${ship.name} est touché`)
                            text = `Votre ${ship.name} est touché 🤕`
                            grid[i + 1].display = '💥'
                            coord_hit.push(i + 1)
                            let sunk = this.Check_sunk_you(grid, ship, coord_hit)
                            if (sunk) {
                                text = sunk[0];
                                coord_hit = sunk[1]
                            }
                            break
                        }
                        else if (grid[i + 1].display === null) {
                            grid[i + 1].display = '🌀'
                            break
                        }
                    }
                    else if ((grid[i - 1].display !== '🌀') && (grid[i - 1].display !== '☠️')) {
                        if ((grid[i - 1].valeur === ship.emo) && (grid[i - 1].display !== '☠️')) {
                            ship.hit += 1
                            console.log(`${ship.hit} hit`)
                            console.log(`Votre ${ship.name} est touché`)
                            text = `Votre ${ship.name} est touché 🤕`
                            grid[i - 1].display = '💥'
                            coord_hit.push(i - 1)
                            let sunk = this.Check_sunk_you(grid, ship, coord_hit)
                            if (sunk) {
                                text = sunk[0];
                                coord_hit = sunk[1]
                            }
                            break
                        }
                        else if (grid[i - 1].display === null) {
                            grid[i - 1].display = '🌀'
                            break
                        }
                    }
                }

                else if (grid[i].id[1] === 0) {
                    if ((grid[i + 1].display !== '🌀') && (grid[i + 1].display !== '☠️')) {
                        if ((grid[i + 1].valeur === ship.emo) && (grid[i + 1].display !== '☠️')) {
                            ship.hit += 1
                            console.log(`${ship.hit} hit`)
                            console.log(`Votre ${ship.name} est touché`)
                            text = `Votre ${ship.name} est touché 🤕`
                            grid[i + 1].display = '💥'
                            coord_hit.push(i + 1)
                            let sunk = this.Check_sunk_you(grid, ship, coord_hit)
                            if (sunk) {
                                text = sunk[0];
                                coord_hit = sunk[1]
                            }
                            break
                        }
                        else if (grid[i + 1].display === null) {
                            grid[i + 1].display = '🌀'
                            break
                        }
                    }
                }
            
                else if (grid[i].id[1] === 9) {
                    if ((grid[i - 1].display !== '🌀') && (grid[i - 1].display !== '☠️')) {
                        if (grid[i - 1].valeur === ship.emo) {
                            ship.hit += 1
                            console.log(`${ship.hit} hit`)
                            console.log(`Votre ${ship.name} est touché`)
                            text = `Votre ${ship.name} est touché 🤕`
                            grid[i - 1].display = '💥'
                            coord_hit.push(i - 1)
                            let sunk = this.Check_sunk_you(grid, ship, coord_hit)
                            if (sunk) {
                                text = sunk[0];
                                coord_hit = sunk[1]
                            }
                            break
                        }
                        else if (grid[i - 1].display === null) {
                            grid[i - 1].display = '🌀'
                            break
                        }
                    }
                }
            
            this.Check_defeat_you(grid)
        }
        // console.log("coord_hit:", coord_hit)

    }
     

        else if (count_strike >= 2) {
            let i = coord_hit[coord_hit.length - 1]
            // console.log("coord_hit_ref:", i)
            

            for (const ship of ships) {
                // Vertical
                if ((grid[i].id[0] > 0) && (grid[i].id[0] < 9)) {

                    if ((grid[i - 10].display === '💥') && ((grid[i + 10].display !== '🌀') && (grid[i + 10].display !== '☠️'))) {
                        if (grid[i + 10].valeur === ship.emo) {
                            console.log("here:", ship.emo)
                            text = `Votre ${ship.name} est touché 🤕`
                            grid[i + 10].display = '💥'
                            ship.hit += 1
                            coord_strike.push(i + 10)
                            console.log("touché en bas")
                            coord_hit.push(i+10)
                            // console.log("coord_hit_list:", coord_hit)
                            let sunk = this.Check_sunk_you(grid, ship, coord_hit)
                            if (sunk) {
                                text = sunk[0];
                                coord_hit = sunk[1]
                            }
                            break
                        }
                        else if (grid[i + 10].display === null) {
                                grid[i + 10].display = '🌀'
                                console.log("dans l'eau")
                                coord_hit = coord_hit.reverse()
                                // console.log("coord_hit_list:", coord_hit)
                                break
                        }
                    }
                    else if ((grid[i + 10].display === '💥') && ((grid[i - 10].display !== '🌀') && (grid[i - 10].display !== '☠️'))) {
                        if (grid[i - 10].valeur === ship.emo) {
                            console.log("here:", ship.emo)
                            text = `Votre ${ship.name} est touché 🤕`
                            grid[i - 10].display = '💥'
                            ship.hit += 1
                            coord_strike.push(i - 10)
                            console.log("touché en haut")
                            coord_hit.push(i-10)
                            // console.log("coord_hit_list:", coord_hit)
                            let sunk = this.Check_sunk_you(grid, ship, coord_hit)
                            if (sunk) {
                                text = sunk[0];
                                coord_hit = sunk[1]
                            }
                            break
                        }
                        else if (grid[i - 10].display === null) {
                                grid[i - 10].display = '🌀'
                                console.log("dans l'eau")
                                coord_hit = coord_hit.reverse()
                                // console.log("coord_hit_list:", coord_hit)
                                break
                        }
                    }
                    if ((grid[i - 10].display === '💥') && ((grid[i + 10].display === '🌀') || grid[i + 10].display === '☠️')) {

                        coord_hit = coord_hit.reverse()
                        // console.log("coord_hit_list:", coord_hit)
                        i = coord_hit[coord_hit.length - 1]

                        if (grid[i - 10].valeur === ship.emo) {
                            console.log("here:", ship.emo)
                            text = `Votre ${ship.name} est touché 🤕`
                            grid[i - 10].display = '💥'
                            ship.hit += 1
                            coord_strike.push(i - 10)
                            console.log("touché en bas")
                            coord_hit.push(i - 10)
                            // console.log("coord_hit_list:", coord_hit)
                            let sunk = this.Check_sunk_you(grid, ship, coord_hit)
                            if (sunk) {
                                text = sunk[0];
                                coord_hit = sunk[1]
                            }
                            break
                        }
                        else if (grid[i - 10].display === null) {
                                grid[i - 10].display = '🌀'
                                console.log("dans l'eau")
                                // console.log("coord_hit_list:", coord_hit)
                                break
                        }
                    }
                    else if (grid[i + 10].display === '💥' && ((grid[i - 10].display === '🌀') || (grid[i - 10].display === '☠️'))) {
                        coord_hit = coord_hit.reverse()
                        // console.log("coord_hit_list:", coord_hit)
                        i = coord_hit[coord_hit.length - 1]

                        if (grid[i + 10].valeur === ship.emo) {
                            console.log("here:", ship.emo)
                            text = `Votre ${ship.name} est touché 🤕`
                            grid[i + 10].display = '💥'
                            ship.hit += 1
                            coord_strike.push(i + 10)
                            console.log("touché en haut")
                            coord_hit.push(i + 10)
                            // console.log("coord_hit_list:", coord_hit)
                            let sunk = this.Check_sunk_you(grid, ship, coord_hit)
                            if (sunk) {
                                text = sunk[0];
                                coord_hit = sunk[1]
                            }
                            break
                        }
                        else if (grid[i + 10].display === null) {
                                grid[i + 10].display = '🌀'
                                console.log("dans l'eau")
                                // console.log("coord_hit_list:", coord_hit)
                                break
                        }
                    }
                }

                else if (grid[i].id[0] === 0) {
                    if (grid[i + 10].display === '💥') {

                        coord_hit = coord_hit.reverse()
                        // console.log("coord_hit_list:", coord_hit)
                        i = coord_hit[coord_hit.length - 1]

                        if ((grid[i + 10].valeur === ship.emo) && (grid[i + 10].display !== '☠️')) {
                            console.log("here:", ship.emo)
                            text = `Votre ${ship.name} est touché 🤕`
                            grid[i + 10].display = '💥'
                            ship.hit += 1
                            coord_strike.push(i + 10)
                            console.log("touché en bas")
                            coord_hit.push(i + 10)
                            // console.log("coord_hit_list:", coord_hit)
                            let sunk = this.Check_sunk_you(grid, ship, coord_hit)
                            if (sunk) {
                                text = sunk[0];
                                coord_hit = sunk[1]
                            }
                            break
                        }
                        else if (grid[i + 10].display === null) {
                                grid[i + 10].display = '🌀'
                                console.log("dans l'eau")
                                // console.log("coord_hit_list:", coord_hit)
                                break
                            }
                        }
                    }
                    else if (grid[i].id[0] === 9) {
                        if (grid[i - 10].display === '💥') {
    
                            coord_hit = coord_hit.reverse()
                            // console.log("coord_hit_list:", coord_hit)
                            i = coord_hit[coord_hit.length - 1]
                            console.log("hit_ref:", i)
    
                            if ((grid[i - 10].valeur === ship.emo) && (grid[i - 10].display !== '☠️')) {
                                console.log("here:", ship.emo)
                                text = `Votre ${ship.name} est touché 🤕`
                                grid[i - 10].display = '💥'
                                ship.hit += 1
                                coord_strike.push(i - 10)
                                console.log("touché en bas")
                                coord_hit.push(i - 10)
                                // console.log("coord_hit_list:", coord_hit)
                                let sunk_text = this.Check_sunk_you(grid, ship, coord_hit, text)
                                if (sunk_text) {
                                    text = sunk_text
                                }
                                break
                            }
                            else if (grid[i - 10].display === null) {
                                    grid[i - 10].display = '🌀'
                                    console.log("dans l'eau")
                                    // console.log("coord_hit_list:", coord_hit)
                                    break
                                }
                            }
                        }
    
                //  Horizontal
                if ((grid[i].id[1] > 0) && (grid[i].id[1] < 9)) {

                    if ((grid[i + 1].display === '💥') && ((grid[i - 1].display !== '🌀') && (grid[i - 1].display !== '☠️'))) {
                        if (grid[i - 1].valeur === ship.emo) {
                            console.log("here:", ship.emo)
                            text = `Votre ${ship.name} est touché 🤕`
                            grid[i - 1].display = '💥'
                            ship.hit += 1
                            coord_strike.push(i-1)
                            console.log("touché à gauche")
                            coord_hit.push(i-1)
                            // console.log("coord_hit_list:", coord_hit)
                            let sunk = this.Check_sunk_you(grid, ship, coord_hit)
                            if (sunk) {
                                text = sunk[0];
                                coord_hit = sunk[1]
                            }
                            break
                        }
                        else if (grid[i - 1].display === null) {
                                grid[i - 1].display = '🌀'
                                console.log("dans l'eau")
                                coord_hit = coord_hit.reverse()
                                // console.log("coord_hit_list:", coord_hit)
                                break
                        }
                        }

                    else if ((grid[i - 1].display === '💥') && ((grid[i + 1].display !== '🌀') && (grid[i + 1].display !== '☠️'))) {
                        if (grid[i + 1].valeur === ship.emo) {
                            console.log("here:", ship.emo)
                            text = `Votre ${ship.name} est touché 🤕`
                            grid[i + 1].display = '💥'
                            ship.hit += 1
                            coord_strike.push(i+1)
                            console.log("touché à droite")
                            coord_hit.push(i+1)
                            // console.log("coord_hit_list:", coord_hit)
                            let sunk = this.Check_sunk_you(grid, ship, coord_hit)
                            if (sunk) {
                                text = sunk[0];
                                coord_hit = sunk[1]
                            }
                            break
                            }
                        else if (grid[i + 1].display === null) {
                                grid[i + 1].display = '🌀'
                                console.log("dans l'eau")
                                coord_hit = coord_hit.reverse()
                                // console.log("coord_hit_list:", coord_hit)
                                break
                            }
                        }
                    
                    if ((grid[i + 1].display === '💥') && ((grid[i - 1].display === '🌀') || (grid[i - 1].display === '☠️'))) {

                        coord_hit = coord_hit.reverse()
                        // console.log("coord_hit_list:", coord_hit)
                        i = coord_hit[coord_hit.length - 1]

                        if (grid[i + 1].valeur === ship.emo) {
                            console.log("here:", ship.emo)
                            text = `Votre ${ship.name} est touché 🤕`
                            grid[i + 1].display = '💥'
                            ship.hit += 1
                            coord_strike.push(i-1)
                            console.log("touché à gauche")
                            coord_hit.push(i + 1)
                            // console.log("coord_hit_list:", coord_hit)
                            let sunk = this.Check_sunk_you(grid, ship, coord_hit)
                            if (sunk) {
                                text = sunk[0];
                                coord_hit = sunk[1]
                            }
                            break
                        }
                        else if (grid[i + 1].display === null) {
                                grid[i + 1].display = '🌀'
                                console.log("dans l'eau")
                                // console.log("coord_hit_list:", coord_hit)
                                break
                        }
                        }

                    else if ((grid[i - 1].display === '💥') && ((grid[i + 1].display === '🌀') || (grid[i + 1].display === '☠️'))) {

                        coord_hit = coord_hit.reverse()
                        // console.log("coord_hit_list:", coord_hit)
                        i = coord_hit[coord_hit.length - 1]

                        if ((grid[i - 1].valeur === ship.emo) && (grid[i - 1].display !== '☠️')) {
                            console.log("here:", ship.emo)
                            text = `Votre ${ship.name} est touché 🤕`
                            grid[i - 1].display = '💥'
                            ship.hit += 1
                            coord_strike.push(i - 1)
                            console.log("touché à droite")
                            coord_hit.push(i - 1)
                            // console.log("coord_hit_list:", coord_hit)
                            let sunk = this.Check_sunk_you(grid, ship, coord_hit)
                            if (sunk) {
                                text = sunk[0];
                                coord_hit = sunk[1]
                            }
                            break
                            }
                        else if (grid[i - 1].display === null) {
                                grid[i - 1].display = '🌀'
                                console.log("dans l'eau")
                                // console.log("coord_hit_list:", coord_hit)
                                break
                            }
                        }
                    }
                
                else if (grid[i].id[1] === 0) {
                    if (grid[i + 1].display === '💥') {

                        coord_hit = coord_hit.reverse()
                        i = coord_hit[coord_hit.length - 1]
                        // console.log("coord_hit:", coord_hit)
                        // console.log("hit ref:", i)

                        if ((grid[i + 1].valeur === ship.emo) && (grid[i + 1].display !== '☠️')) {
                            console.log("here:", ship.emo)
                            text = `Votre ${ship.name} est touché 🤕`
                            grid[i + 1].display = '💥'
                            ship.hit += 1
                            coord_strike.push(i + 1)
                            console.log("touché en bas")
                            coord_hit.push(i + 1)
                            // console.log("coord_hit_list:", coord_hit)
                            let sunk = this.Check_sunk_you(grid, ship, coord_hit)
                            if (sunk) {
                                text = sunk[0];
                                coord_hit = sunk[1]
                            }
                            break
                        }
                        else if (grid[i + 1].display === null) {
                                grid[i + 1].display = '🌀'
                                console.log("dans l'eau")
                                coord_hit = coord_hit.reverse()
                                // console.log("coord_hit_list:", coord_hit)
                                break
                            }
                        }
                    }
                else if (grid[i].id[1] === 9) {
                    if (grid[i - 1].display === '💥') {
    
                        coord_hit = coord_hit.reverse()
                        i = coord_hit[coord_hit.length - 1]
                        // console.log("coord_hit:", coord_hit)
                        // console.log("hit ref:", i)

                        if ((grid[i - 1].valeur === ship.emo) && (grid[i - 1].display !== '☠️')) {
                            console.log("here:", ship.emo)
                            text = `Votre ${ship.name} est touché 🤕`
                            grid[i - 1].display = '💥'
                            ship.hit += 1
                            coord_strike.push(i - 1)
                            console.log("touché en bas")
                            coord_hit.push(i - 1)
                            console.log("coord_hit_list:", coord_hit)
                            let sunk = this.Check_sunk_you(grid, ship, coord_hit)
                            if (sunk) {
                                text = sunk[0];
                                coord_hit = sunk[1]
                            }
                            break
                        }
                        else if (grid[i - 1].display === null) {
                                grid[i - 1].display = '🌀'
                                console.log("dans l'eau")
                                coord_hit = coord_hit.reverse()
                                console.log("coord_hit_list:", coord_hit)
                                break
                            }
                        }
                    }
                }
            } 
        this.DisplayAlgoShootReport(text)
        this.Check_defeat_you(grid, algo_grid)

        this.setState({
            your_grid: grid,
            opponent_grid: algo_grid,
            coord_hit: coord_hit,
        })

        this.onBtnClick()
    }

    Check_sunk_algo = (grid, ship) => {
        if (ship.hit === ship.size) {
            console.log(`${ship.name} ennemi coulé`)
            let sunk_text = `${ship.name} ennemi coulé 💯`
            for (let i=0; i < grid.length; i++) {
                if ((grid[i].valeur === ship.emo) && (grid[i].display !== '☠️')) {
                    grid[i].display = '☠️'
                }
            }
            return sunk_text
        }
    }

    Check_sunk_you = (grid, ship, coord_hit) => {
        if (ship.hit === ship.size) {
            console.log(`Votre ${ship.name} est coulé`)
            let sunk_text = `Votre ${ship.name} est coulé 😵`
            for (let i=0; i < grid.length; i++) {
                if ((grid[i].valeur === ship.emo) && (grid[i].display !== '☠️')) {
                    grid[i].display = '☠️'
                }
            }

            let new_coord_hit = coord_hit.slice(0, coord_hit.length - ship.size)
            coord_hit = new_coord_hit.reverse()
            console.log("ship size:", ship.size)
            console.log("sliced coord_hit:", coord_hit)
            return [sunk_text, coord_hit]
        }
    }

    Check_defeat_algo = (algo_grid) => {
        let count = 0
        for (let i=0; i < algo_grid.length; i++) {
            if (algo_grid[i].display === '☠️') {
                count+= 1
            }
        }
        if (count === 14) {
            this.setState({score_you: this.state.score_you += 1});
            setTimeout(() => {
                let id = 1
                this.EndGameModal(id)
            }, 1)
        }
    }

    Check_defeat_you = (your_grid, algo_grid) => {
        let count = 0
        for (let i=0; i < your_grid.length; i++) {
            if (your_grid[i].display === '☠️') {
                count+= 1
            }
        }
        if (count === 14) {
            this.RevealAlgoShipsWhenDefeatYou(algo_grid);
            this.setState({score_opponent: this.state.score_opponent += 1});
            
            setTimeout(() => {
                let id = 0
                this.EndGameModal(id)
            }, 20)
        }
    }

    RevealAlgoShipsWhenDefeatYou = (algo_grid) => {
        for (let i=0; i < algo_grid.length; i++) {
            for (const ship of algo_ships) {
            if ((algo_grid[i].valeur === ship.emo) && ((algo_grid[i].display === null) || (algo_grid[i].display === '💥'))) {
                algo_grid[i].display = ship.emo
                }
            }
        }
        this.setState({
            opponent_grid: algo_grid
        })
    }


    EndGameModal(grid_id) {

        if (grid_id === 0) {

            let modal = document.getElementById("Modal-defeat");
            modal.style.display = "block";
            this.DisplayScore();
            this.ResetShipsHealth();

            let span = document.getElementsByClassName("close")[0];
            
            span.onclick = (event) => {
            modal.style.display = "none";
            this.Reset();
            }

            window.onclick = (event) => {
            if (event.target === modal) {
                modal.style.display = "none";
                this.Reset();
                }
            }
        }

        else if (grid_id === 1) {
            
            let modal = document.getElementById("Modal-victory");
            modal.style.display = "block";
            this.DisplayScore();
            this.ResetShipsHealth();

            let span = document.getElementsByClassName("close")[0];

            span.onclick = (event) => {
            modal.style.display = "none";
            this.Reset();
            }

            window.onclick = (event) => {
            if (event.target === modal) {
                modal.style.display = "none";
                this.Reset();
                }
            }
        }
    }



    render() {
    return (
        <>
            <div className="wrapper" key={this.props.id}>
            {this.props.grid.map((cell, i) => { 
                return (
                        <div className="cell" key={cell.id} onClick={() => this.On_Trigger(cell.id)}>{cell.display}</div>
                    )})}
            </div>
        </>
        )
}
}



export default OpponentGrid
 