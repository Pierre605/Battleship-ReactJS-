import React from 'react'
import './Grid.css'
import { useState, useEffect } from 'react';

const ships = [{"name": "Porte-avion", "size": 5, "emo": '✈️'}, {"name": "Croiseur", "size": 4, "emo": '⚔️'}, {"name": "Sous-Marin", "size": 3, "emo": '⚜️'}, {"name": "Torpilleur", "size": 2, "emo": '🛡️'}]

class Grid extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
                grid: this.props.grid,
                selected_ship: [],
                direction: []
                }
        }
    
    

    componentDidMount() {
        this.setState({ grid: this.props.grid });
    }



    display_props = (cell_id) => {
        console.log(cell_id)
        let ship = this.props.selected
        console.log(ship.size)
    }

    SelectShips = () => {
        let ship = document.getElementsByName('ship')
        let selected = []
        let name = ''
        for (let i = 0; i < ship.length; i++) {
            if (ship[i].checked === true) {
                name = ship[i].id
            }
        }
        for (let i = 0; i < ships.length; i++) {
            if (ships[i].name === name) {
                selected = ships[i]
            }
        }
        console.log(selected.name)
        this.setState({selected_ship: selected})
    }

    SelectDir = () => {
        let direction = document.getElementsByName('direction')
        let dir = ''
        for (let i = 0; i < direction.length; i++) {
            if (direction[i].checked === true) {
                dir = direction[i].value
            }
        }
        console.log(dir)
        this.setState({direction: dir})
    }


    PlaceShips = (cell_id) => {
        let grid1 = this.props.grid
        let ship = this.state.selected_ship
        let count_h = 0
        let count_v = 0
        console.log(cell_id)

        for (let i=0; i < grid1.length; i++) {
            if (grid1[i].valeur === ship.emo) {
                grid1[i].valeur = null
                grid1[i].display = null
                }
            }
            this.setState({grid: grid1})

        setTimeout(() => {this.ChangeCells()}, 0);
            

        if (this.state.direction === 'h')  {
            for (let i=0; i < ship.size; i++) {

                if (grid1[cell_id[0]*10 + cell_id[1]].id[1] <= 10 - ship.size) {

                    if ((cell_id[1] > 0) && (cell_id[1] < 10 - ship.size)) {

                        if ((cell_id[0] > 0) && (cell_id[0] < 9)) {
                            
                            if ((grid1[cell_id[0]*10 + cell_id[1] + i].valeur === null) && (grid1[(cell_id[0] - 1)*10 + cell_id[1] + i].valeur === null) && (grid1[(cell_id[0] + 1)*10 + cell_id[1] + i].valeur === null) && (grid1[cell_id[0]*10 + cell_id[1] + ship.size].valeur === null) && (grid1[cell_id[0]*10 + cell_id[1] - 1].valeur === null))  {
                                count_h += 1 
                                }
                            }
                        else if (cell_id[0] === 0) {
                            if ((grid1[cell_id[0]*10 + cell_id[1] + i].valeur === null) && (grid1[(cell_id[0] + 1)*10 + cell_id[1] + i].valeur === null) && (grid1[cell_id[0]*10 + cell_id[1] + ship.size].valeur === null) && (grid1[cell_id[0]*10 + cell_id[1] - 1].valeur === null))  {
                                count_h += 1 
                                }
                            }
                        else if (cell_id[0] === 9) {
                            if ((grid1[cell_id[0]*10 + cell_id[1] + i].valeur === null) && (grid1[(cell_id[0] - 1)*10 + cell_id[1] + i].valeur === null) && (grid1[cell_id[0]*10 + cell_id[1] + ship.size].valeur === null) && (grid1[cell_id[0]*10 + cell_id[1] - 1].valeur === null))  {
                                count_h += 1 
                                }
                            }
                        }

                    else if (cell_id[1] === 0) {
                        if ((cell_id[0] > 0) && (cell_id[0] < 9)) {
                            
                            if ((grid1[cell_id[0]*10 + cell_id[1] + i].valeur === null) && (grid1[(cell_id[0] - 1)*10 + cell_id[1] + i].valeur === null) && (grid1[(cell_id[0] + 1)*10 + cell_id[1] + i].valeur === null) && (grid1[cell_id[0]*10 + cell_id[1] + ship.size].valeur === null))  {
                                count_h += 1 
                                }
                            }
                        else if (cell_id[0] === 0) {
                            if ((grid1[cell_id[0]*10 + cell_id[1] + i].valeur === null) && (grid1[(cell_id[0] + 1)*10 + cell_id[1] + i].valeur === null) && (grid1[cell_id[0]*10 + cell_id[1] + ship.size].valeur === null))  {
                                count_h += 1 
                                }
                            }
                        else if (cell_id[0] === 9) {
                            if ((grid1[cell_id[0]*10 + cell_id[1] + i].valeur === null) && (grid1[(cell_id[0] - 1)*10 + cell_id[1] + i].valeur === null) && (grid1[cell_id[0]*10 + cell_id[1] + ship.size].valeur === null))  {
                                count_h += 1 
                                }
                            }
                        }

                    else if (cell_id[1] === 10 - ship.size) {

                        if ((cell_id[0] > 0) && (cell_id[0] < 9)) {
                            
                            if ((grid1[cell_id[0]*10 + cell_id[1] + i].valeur === null) && (grid1[(cell_id[0] - 1)*10 + cell_id[1] + i].valeur === null) && (grid1[(cell_id[0] + 1)*10 + cell_id[1] + i].valeur === null) && (grid1[cell_id[0]*10 + cell_id[1] - 1].valeur === null) && (grid1[cell_id[0]*10 + cell_id[1] + ship.size].valeur === null))  {
                                count_h += 1 
                                }
                            }
                        else if (cell_id[0] === 0) {
                            if ((grid1[cell_id[0]*10 + cell_id[1] + i].valeur === null) && (grid1[(cell_id[0] + 1)*10 + cell_id[1] + i].valeur === null) && (grid1[cell_id[0]*10 + cell_id[1] - 1].valeur === null))  {
                                count_h += 1 
                                }
                            }
                        else if (cell_id[0] === 9) {
                            if ((grid1[cell_id[0]*10 + cell_id[1] + i].valeur === null) && (grid1[(cell_id[0] - 1)*10 + cell_id[1] + i].valeur === null) && (grid1[cell_id[0]*10 + cell_id[1] - 1].valeur === null))  {
                                count_h += 1 
                                }
                            }
                        }

                    }
                }

            if (count_h === ship.size) {
                for (let i=0; i < ship.size; i++) {
                        grid1[cell_id[0]*10 + cell_id[1] + i].valeur = ship.emo;
                        grid1[cell_id[0]*10 + cell_id[1] + i].display = ship.emo
                        }
                    }   
            this.setState({grid: grid1})
            }

        if (this.state.direction === 'v')  {
            for (let i=0; i < ship.size; i++) {

                if ((cell_id[0] > 0) && (cell_id[0] < 10 - ship.size)) {

                    if (grid1[cell_id[0]*10 + ((ship.size-1)*10) + cell_id[1]]) {
                        if ((cell_id[1] > 0) && (cell_id[1] < 9)) {
                            if ((grid1[cell_id[0]*10 + (i*10) + cell_id[1]].valeur === null) && (grid1[cell_id[0]*10 + (i*10) + cell_id[1] + 1].valeur === null) && (grid1[cell_id[0]*10 + (i*10) + cell_id[1] - 1].valeur === null) && (grid1[(cell_id[0] - 1)*10 + cell_id[1]].valeur === null) && (grid1[(cell_id[0] + ship.size)*10 + cell_id[1]].valeur === null)) {
                                count_v += 1
                                }
                            }
                        else if ((cell_id[1] === 0)) {
                            if ((grid1[cell_id[0]*10 + (i*10) + cell_id[1]].valeur === null) && (grid1[cell_id[0]*10 + (i*10) + cell_id[1] + 1].valeur === null) && (grid1[(cell_id[0] - 1)*10 + cell_id[1]].valeur === null) && (grid1[(cell_id[0] + ship.size)*10 + cell_id[1]].valeur === null)) {
                                count_v += 1
                                }
                            }
                        else if (cell_id[1] === 9) {
                            if ((grid1[cell_id[0]*10 + (i*10) + cell_id[1]].valeur === null) && (grid1[cell_id[0]*10 + (i*10) + cell_id[1] - 1].valeur === null) && (grid1[(cell_id[0] - 1)*10 + cell_id[1]].valeur === null) && (grid1[(cell_id[0] + ship.size)*10 + cell_id[1]].valeur === null)) {
                                count_v += 1
                                }
                            }
                        }
                    }

                    else if (cell_id[0] === 0) {
                        if (grid1[cell_id[0]*10 + ((ship.size-1)*10) + cell_id[1]]) {
                            if ((cell_id[1] > 0) && (cell_id[1] < 9)) {
                                if ((grid1[cell_id[0]*10 + (i*10) + cell_id[1]].valeur === null) && (grid1[cell_id[0]*10 + (i*10) + cell_id[1] + 1].valeur === null) && (grid1[cell_id[0]*10 + (i*10) + cell_id[1] - 1].valeur === null) && (grid1[(cell_id[0] + ship.size)*10 + cell_id[1]].valeur === null)) {
                                    count_v += 1
                                    }
                                }
                            else if ((cell_id[1] === 0)) {
                                if ((grid1[cell_id[0]*10 + (i*10) + cell_id[1]].valeur === null) && (grid1[cell_id[0]*10 + (i*10) + cell_id[1] + 1].valeur === null) && (grid1[(cell_id[0] + ship.size)*10 + cell_id[1]].valeur === null)) {
                                    count_v += 1
                                    }
                                }
                            else if (cell_id[1] === 9) {
                                if ((grid1[cell_id[0]*10 + (i*10) + cell_id[1]].valeur === null) && (grid1[cell_id[0]*10 + (i*10) + cell_id[1] - 1].valeur === null) && (grid1[(cell_id[0] + ship.size)*10 + cell_id[1]].valeur === null)) {
                                    count_v += 1
                                    }
                                }
                            }
                        }
                        else if (cell_id[0] === 10 - ship.size) {

                            if (grid1[cell_id[0]*10 + ((ship.size-1)*10) + cell_id[1]]) {
                                if ((cell_id[1] > 0) && (cell_id[1] < 9)) {
                                    if ((grid1[cell_id[0]*10 + (i*10) + cell_id[1]].valeur === null) && (grid1[cell_id[0]*10 + (i*10) + cell_id[1] + 1].valeur === null) && (grid1[cell_id[0]*10 + (i*10) + cell_id[1] - 1].valeur === null) && (grid1[(cell_id[0] - 1)*10 + cell_id[1]].valeur === null) ) {
                                        count_v += 1
                                        }
                                    }
                                else if ((cell_id[1] === 0)) {
                                    if ((grid1[cell_id[0]*10 + (i*10) + cell_id[1]].valeur === null) && (grid1[cell_id[0]*10 + (i*10) + cell_id[1] + 1].valeur === null) && (grid1[(cell_id[0] - 1)*10 + cell_id[1]].valeur === null)) {
                                        count_v += 1
                                        }
                                    }
                                else if (cell_id[1] === 9) {
                                    if ((grid1[cell_id[0]*10 + (i*10) + cell_id[1]].valeur === null) && (grid1[cell_id[0]*10 + (i*10) + cell_id[1] - 1].valeur === null) && (grid1[(cell_id[0] - 1)*10 + cell_id[1]].valeur === null)) {
                                        count_v += 1
                                        }
                                    }
                                }
                            }
                    
            }
            if (count_v === ship.size) {
                for (let i=0; i < ship.size; i++) {
                        grid1[cell_id[0]*10 + (i*10) + cell_id[1]].valeur = ship.emo;
                        grid1[cell_id[0]*10 + (i*10) + cell_id[1]].display = ship.emo
                        }
                    }
             this.setState({grid: grid1})
            }

        setTimeout(() => {this.ChangeCells()}, 0)
        
        // Ready grid check
        let play = document.getElementById("play")
        let count_full = 0
        for (let i=0; i < grid1.length; i++) {
            if (grid1[i].valeur !== null) {
                count_full += 1
                }
            }
        if (count_full == 14) {
            play.style.display = 'block'
        }
        else {
            play.style.display = 'block'
        }
    }

    ChangeCells = () => {
        let cells = document.getElementsByClassName('cell')
        for (let i = 0; i < cells.length; i++) {
            if (cells[i].textContent !== '' && cells[i].textContent !== '🌀') {
                cells[i].style.border = 'none';
                cells[i].style.backgroundColor = 'lightgray'
            }
            else {
                cells[i].style.border = '1px solid black'
                cells[i].style.backgroundColor = 'rgb(1, 34, 123)';;
            }
        }
    }

    Display_opp_grid()  {
        
        console.log("pressed")
        let opp_grid = document.getElementById("opp-grid")
        opp_grid.style.display = 'block'

        let aside = document.getElementById('aside')
        aside.classList.add('flex')

        let div_settings = document.getElementById('grid-setting')
        div_settings.style.display = 'none'

        this.setState({selected_ship: []})

    }



    render() {
    return (
        <>
        <div id='main'>
            <div id="grid-setting">
                <div>
                    {ships.map((ship) => {
                        return (
                        <div className='aside'>
                            <div>{ship.name} {ship.emo.repeat(ship.size)}</div>
                            <div onClick={this.SelectShips}>
                                <input type="radio" id={ship.name} name="ship" value={ship}/>
                            </div>
                        </div>
                    )})}
                </div>
                <div onClick={this.SelectDir}>
                    <div>
                        <input type="radio" id="1" name="direction" value="h" />
                        <label for="h">Horizontalement</label>
                    </div>
                    <div>
                        <input type="radio" id="2" name="direction" value="v"/>
                        <label for="v">Verticalement</label>
                    </div>
                </div>
                <div id='play' onClick={() => this.Display_opp_grid()}>
                    <input type="button" value='Jouer'/>
                </div>
            </div>
        
            <div className="wrapper" key={this.props.id}>
            {this.props.grid.map((cell, i) => { 
                return (
                        <div className="cell" key={cell.id} onClick={() => this.PlaceShips(cell.id)}>{cell.display}</div>
                    )})}
            </div>
        </div>
        </>
        )
}
}



export default Grid
 