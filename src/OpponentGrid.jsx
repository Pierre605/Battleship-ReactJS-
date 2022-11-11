import React from 'react'
import './Grid.css'
import { useState, useEffect } from 'react';

const ships = [{"name": "Porte-avion", "size": 5, "emo": '✈️', 'hit': 0}, {"name": "Croiseur", "size": 4, "emo": '⚔️', 'hit': 0}, {"name": "Sous-Marin", "size": 3, "emo": '⚜️', 'hit': 0}, {"name": "Torpilleur", "size": 2, "emo": '🛡️', 'hit': 0}]
const your_emos = ['⚔️', '✈️', '🛡️', '⚜️']
const algo_ships = [{"name": "Porte-avion", "size": 5, "emo": '🛩️', 'hit': 0}, {"name": "Croiseur", "size": 4, "emo": '⚔️', 'hit': 0}, {"name": "Sous-Marin", "size": 3, "emo": '🏴', 'hit': 0}, {"name": "Torpilleur", "size": 2, "emo": '🗡️', 'hit': 0}]

class OpponentGrid extends React.Component {
    constructor (props) {
        super (props);
        this.state = {
            opponent_grid: this.props.grid,
            your_grid: this.props.your_grid,
            coord_hit: '',
        }
    this.onBtnClick = this.onBtnClick.bind(this);
    }

    onBtnClick() {
        // this.setState({ your_grid: this.state.grid});
        this.props.rerenderParentCallback();
    }


    componentDidMount() {
        this.setState({ opponent_grid: this.props.grid});
        this.setState({ your_grid: this.props.your_grid });
        this.setState({ coord_hit: [] });
    }


    On_Trigger = (cell_id) => {
        let index = cell_id[0]*10 + cell_id[1]
        let grid = this.props.grid

        if (grid[index].display === null) {
            grid[index].display = '🌀';
            }
        else if (grid[index].valeur in ['🌀', '💥']) {
        }
        else {
            for (const ship of algo_ships) {
                if (grid[index].valeur === ship.emo) {
                    grid[index].display = '💥'
                    ship.hit += 1
                    console.log(`${ship.hit} hit`)
                    console.log(`${ship.name} ennemi touché`)

                    this.Check_sunk(grid, ship)
                    this.Check_defeat(grid)
                }
            }
        }
        console.log(cell_id)
        this.setState({
            opponent_grid: grid,
        })
        setTimeout(() => {this.Algo_player()}, 275)
    }


    Algo_player = () => {
        let grid = this.props.your_grid
        let n = 0
        let r = []
        let r_idx = []
        let available = []
        let count_strike = 0
        let count_miss = 0
        let coord_strike = []
        let coord_hit = this.state.coord_hit
        
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
                r.push(available[random_place_i]);
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
                        coord_hit.push(r_idx[i])
                        break
                    }
                else if (grid[r_idx[i]].display === null) {
                    grid[r_idx[i]].display = '🌀'
                    break
                }
            } break
        }
    }
        
        else if (count_strike === 1)  {
            let coord_hit = this.state.coord_hit
            let i = coord_hit[coord_hit.length - 1]
            console.log("coord_hit_ref:", i)
            console.log("coord_strike:", coord_strike)

            for (const ship of ships) {
                // Vertical
                if ((grid[i + 10]) && (grid[i - 10]))   {
                    if (grid[i + 10].display !== '🌀') {
                        if (grid[i +10].display === ship.emo) {
                            ship.hit += 1
                            console.log(`${ship.hit} hit`)
                            console.log(`Votre ${ship.name} est touché`)
                            grid[i +10].display = '💥'
                            coord_hit.push(i + 10)
                            this.Check_sunk(grid, ship, coord_hit)
                            break
                        }
                    
                        else if (grid[i +10].display === null) {
                            grid[i +10].display = '🌀'
                            break
                        }
                    }
                    else if (grid[i - 10].display !== '🌀') {
                        if (grid[i - 10].display === ship.emo) {
                            ship.hit += 1
                            console.log(`${ship.hit} hit`)
                            console.log(`Votre ${ship.name} est touché`)
                            grid[i - 10].display = '💥'
                            coord_hit.push(i - 10)
                            this.Check_sunk(grid, ship, coord_hit)
                            break
                        }
                    
                        else if (grid[i - 10].display === null) {
                            grid[i - 10].display = '🌀'
                            break
                        }
                    }
                }

                else if ((grid[i + 10]) && (!(grid[i - 10]))) {
                    if (grid[i + 10].display !== '🌀') {
                        if (grid[i + 10].display === ship.emo) {
                            ship.hit += 1
                            console.log(`${ship.hit} hit`)
                            console.log(`Votre ${ship.name} est touché`)
                            grid[i + 10].display = '💥'
                            coord_hit.push(i + 10)
                            this.Check_sunk(grid, ship, coord_hit)
                            break
                        }
                        else if (grid[i + 10].display === null) {
                            grid[i + 10].display = '🌀'
                            break
                        }
                    }
                }
                
                else if ((!(grid[i + 10])) && (grid[i - 10])) {
                    if (grid[i - 10].display !== '🌀') {
                        if (grid[i - 10].display === ship.emo) {
                            ship.hit += 1
                            console.log(`${ship.hit} hit`)
                            console.log(`Votre ${ship.name} est touché`)
                            grid[i - 10].display = '💥'
                            coord_hit.push(i - 10)
                            this.Check_sunk(grid, ship, coord_hit)
                            break
                        }
                        else if (grid[i - 10].display === null) {
                            grid[i - 10].display = '🌀'
                            break
                        }
                    }
                }
                
                // Horizontal
                if ((grid[i + 1]) && (grid[i - 1])) {
                    if (grid[i + 1].display !== '🌀') {
                        if (grid[i + 1].display === ship.emo) {
                            ship.hit += 1
                            console.log(`${ship.hit} hit`)
                            console.log(`Votre ${ship.name} est touché`)
                            grid[i + 1].display = '💥'
                            coord_hit.push(i + 1)
                            this.Check_sunk(grid, ship, coord_hit)
                            break
                        }
                        else if (grid[i + 1].display === null) {
                            grid[i + 1].display = '🌀'
                            break
                        }
                    }
                    else if (grid[i - 1].display !== '🌀') {
                        if (grid[i - 1].display === ship.emo) {
                            ship.hit += 1
                            console.log(`${ship.hit} hit`)
                            console.log(`Votre ${ship.name} est touché`)
                            grid[i - 1].display = '💥'
                            coord_hit.push(i - 1)
                            this.Check_sunk(grid, ship, coord_hit)
                            break
                        }
                    
                        else if (grid[i - 1].display === null) {
                            grid[i - 1].display = '🌀'
                            break
                        }
                    }
                }

                else if ((grid[i + 1]) && (!(grid[i - 1]))) {
                    if (grid[i + 1].display !== '🌀') {
                        if (grid[i + 1].display === ship.emo) {
                            ship.hit += 1
                            console.log(`${ship.hit} hit`)
                            console.log(`Votre ${ship.name} est touché`)
                            grid[i + 1].display = '💥'
                            coord_hit.push(i - 1)
                            this.Check_sunk(grid, ship, coord_hit)
                            break
                        }
                        else if (grid[i + 1].display === null) {
                            grid[i + 1].display = '🌀'
                            break
                        }
                    }
                }
            
                else if ((!(grid[i + 1])) && (grid[i - 1])) {
                    if (grid[i - 1].display !== '🌀') {
                        if (grid[i - 1].display === ship.emo) {
                            ship.hit += 1
                            console.log(`${ship.hit} hit`)
                            console.log(`Votre ${ship.name} est touché`)
                            grid[i - 1].display = '💥'
                            coord_hit.push(i - 1)
                            this.Check_sunk(grid, ship, coord_hit)
                            break
                        }
                        else if (grid[i - 1].display === null) {
                            grid[i - 1].display = '🌀'
                            break
                        }
                    }
                }
            
            this.Check_defeat(grid)
        }
        console.log("coord_hit:", coord_hit)

    }
     

        else if (count_strike >= 2) {
            let coord_hit = this.state.coord_hit
            let i = coord_hit[coord_hit.length - 1]
            console.log("coord_hit_ref:", i)
            

            for (const ship of ships) {
                // Vertical
                if ((grid[i + 10]) && (grid[i - 10])) {

                    if ((grid[i - 10].display === '💥') && (grid[i + 10].display !== '🌀')) {
                        if (grid[i + 10].display === ship.emo) {
                            console.log("here:", ship.emo)
                            grid[i + 10].display = '💥'
                            ship.hit += 1
                            coord_strike.push(i + 10)
                            console.log("touché en bas")
                            coord_hit.push(i+10)
                            console.log("coord_hit_list:", coord_hit)
                            this.Check_sunk(grid, ship, coord_hit)
                            break
                        }
                        else if (grid[i + 10].display === null) {
                                grid[i + 10].display = '🌀'
                                console.log("dans l'eau")
                                coord_hit = coord_hit.reverse()
                                console.log("coord_hit_list:", coord_hit)
                                break
                        }
                    }
                    else if ((grid[i + 10].display === '💥') && (grid[i - 10].display !== '🌀')) {
                        if (grid[i - 10].display === ship.emo) {
                            console.log("here:", ship.emo)
                            grid[i - 10].display = '💥'
                            ship.hit += 1
                            coord_strike.push(i - 10)
                            console.log("touché en haut")
                            coord_hit.push(i-10)
                            console.log("coord_hit_list:", coord_hit)
                            this.Check_sunk(grid, ship, coord_hit)
                            break
                        }
                        else if (grid[i - 10].display === null) {
                                grid[i - 10].display = '🌀'
                                console.log("dans l'eau")
                                coord_hit = coord_hit.reverse()
                                console.log("coord_hit_list:", coord_hit)
                                break
                        }
                    }
                }
                else if ((grid[i + 10]) && (!(grid[i - 10]))) {
                    if (grid[i + 10].display === '💥') {

                        coord_hit = coord_hit.reverse()
                        i = coord_hit[coord_hit.length]

                        if (grid[i + 10].display === ship.emo) {
                            console.log("here:", ship.emo)
                            grid[i + 10].display = '💥'
                            ship.hit += 1
                            coord_strike.push(i + 10)
                            console.log("touché en bas")
                            coord_hit.push(i + 10)
                            console.log("coord_hit_list:", coord_hit)
                            this.Check_sunk(grid, ship, coord_hit)
                            break
                        }
                        else if (grid[i + 10].display === null) {
                                grid[i + 10].display = '🌀'
                                console.log("dans l'eau")
                                coord_hit = coord_hit.reverse()
                                console.log("coord_hit_list:", coord_hit)
                                break
                            }
                        }
                    }
                    else if ((!(grid[i + 10])) && (grid[i - 10])) {
                        if (grid[i - 10].display === '💥') {
    
                            coord_hit = coord_hit.reverse()
                            i = coord_hit[coord_hit.length]
    
                            if (grid[i - 10].display === ship.emo) {
                                console.log("here:", ship.emo)
                                grid[i - 10].display = '💥'
                                ship.hit += 1
                                coord_strike.push(i - 10)
                                console.log("touché en bas")
                                coord_hit.push(i - 10)
                                console.log("coord_hit_list:", coord_hit)
                                this.Check_sunk(grid, ship, coord_hit)
                                break
                            }
                            else if (grid[i - 10].display === null) {
                                    grid[i - 10].display = '🌀'
                                    console.log("dans l'eau")
                                    coord_hit = coord_hit.reverse()
                                    console.log("coord_hit_list:", coord_hit)
                                    break
                                }
                            }
                        }
    
                //  Horizontal
                if ((grid[i + 1]) && (grid[i - 1])) {

                    if ((grid[i + 1].display === '💥') && (grid[i - 1].display !== '🌀')) {
                        if (grid[i - 1].display === ship.emo) {
                            console.log("here:", ship.emo)
                            grid[i - 1].display = '💥'
                            ship.hit += 1
                            coord_strike.push(i-1)
                            console.log("touché à gauche")
                            coord_hit.push(i-1)
                            console.log("coord_hit_list:", coord_hit)
                            this.Check_sunk(grid, ship, coord_hit)
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

                    else if ((grid[i - 1].display === '💥') && (grid[i + 1].display !== '🌀')) {
                        if (grid[i + 1].display === ship.emo) {
                            console.log("here:", ship.emo)
                            grid[i + 1].display = '💥'
                            ship.hit += 1
                            coord_strike.push(i+1)
                            console.log("touché à droite")
                            coord_hit.push(i+1)
                            console.log("coord_hit_list:", coord_hit)
                            this.Check_sunk(grid, ship, coord_hit)
                            break
                            }
                        else if (grid[i + 1].display === null) {
                                grid[i + 1].display = '🌀'
                                console.log("dans l'eau")
                                coord_hit = coord_hit.reverse()
                                console.log("coord_hit_list:", coord_hit)
                                break
                            }
                        }
                    }
                
                else if ((grid[i + 1]) && (!(grid[i - 1]))) {
                    if (grid[i + 1].display === '💥') {

                        coord_hit = coord_hit.reverse()
                        i = coord_hit[coord_hit.length]

                        if (grid[i + 1].display === ship.emo) {
                            console.log("here:", ship.emo)
                            grid[i + 1].display = '💥'
                            ship.hit += 1
                            coord_strike.push(i + 1)
                            console.log("touché en bas")
                            coord_hit.push(i + 1)
                            console.log("coord_hit_list:", coord_hit)
                            this.Check_sunk(grid, ship, coord_hit)
                            break
                        }
                        else if (grid[i + 1].display === null) {
                                grid[i + 1].display = '🌀'
                                console.log("dans l'eau")
                                coord_hit = coord_hit.reverse()
                                console.log("coord_hit_list:", coord_hit)
                                break
                            }
                        }
                    }
                else if ((!(grid[i + 1])) && (grid[i - 1])) {
                    if (grid[i - 1].display === '💥') {
    
                        coord_hit = coord_hit.reverse()
                        i = coord_hit[coord_hit.length]

                        if (grid[i - 1].display === ship.emo) {
                            console.log("here:", ship.emo)
                            grid[i - 1].display = '💥'
                            ship.hit += 1
                            coord_strike.push(i - 1)
                            console.log("touché en bas")
                            coord_hit.push(i - 1)
                            console.log("coord_hit_list:", coord_hit)
                            this.Check_sunk(grid, ship, coord_hit)
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
        
        this.Check_defeat(grid)

        this.setState({
            your_grid: grid,
            coord_hit: coord_hit,
        })

        this.onBtnClick()
    }

    Check_sunk = (grid, ship, coord_hit) => {
        if (ship.hit === ship.size) {
            console.log(`${ship.name} coulé`)
            for (let i=0; i < grid.length; i++) {
                if (grid[i].valeur === ship.emo) {
                    grid[i].display = '☠️'
                }
            }
            let empty = []
            coord_hit = empty
            // this.setState({coord_hit: coord_hit})
        }
    }

    Check_defeat = (grid) => {
        let count = 0
        for (let i=0; i < grid.length; i++) {
            if (grid[i].display === '☠️') {
                count+= 1
            }
        }
        if (count == 14) {
            setTimeout(() => {alert("Victoire !")}, 150) 
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
 