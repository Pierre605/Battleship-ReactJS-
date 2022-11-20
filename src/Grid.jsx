import React from 'react'
import './Grid.css'
import {ships} from './Ships'
import './PlayButton.css'


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

                if ((cell_id[0] > 0) && (cell_id[0] < 9)) {
                    
                    if ((grid1[cell_id[0]*10 + cell_id[1] + i].valeur === null) && (grid1[(cell_id[0] - 1)*10 + cell_id[1] + i].valeur === null) && (grid1[(cell_id[0] + 1)*10 + cell_id[1] + i].valeur === null) )  {
                        count_h += 1 
                        }
                    }
                else if (cell_id[0] === 0) {
                    if ((grid1[cell_id[0]*10 + cell_id[1] + i].valeur === null) && (grid1[(cell_id[0] + 1)*10 + cell_id[1] + i].valeur === null) )  {
                        count_h += 1 
                        }
                    }
                else if (cell_id[0] === 9) {
                    if ((grid1[cell_id[0]*10 + cell_id[1] + i].valeur === null) && (grid1[(cell_id[0] - 1)*10 + cell_id[1] + i].valeur === null) )  {
                        count_h += 1 
                        }
                    }
                }

            if (count_h === ship.size) {
                for (let i=0; i < ship.size; i++) {
                        grid1[cell_id[0]*10 + cell_id[1] + i].valeur = ship.emo;
                        grid1[cell_id[0]*10 + cell_id[1] + i].display = ship.emo;
                        }
                    }   
            this.setState({grid: grid1})
            }

        if (this.state.direction === 'v')  {
            for (let i=0; i < ship.size; i++) {

                if ((cell_id[1] > 0) && (cell_id[1] < 9)) {
                    if ((grid1[cell_id[0]*10 + (i*10) + cell_id[1]].valeur === null) && (grid1[cell_id[0]*10 + (i*10) + cell_id[1] + 1].valeur === null) && (grid1[cell_id[0]*10 + (i*10) + cell_id[1] - 1].valeur === null)) {
                        count_v += 1
                        }
                    }
                else if ((cell_id[1] === 0)) {
                    if ((grid1[cell_id[0]*10 + (i*10) + cell_id[1]].valeur === null) && (grid1[cell_id[0]*10 + (i*10) + cell_id[1] + 1].valeur === null)) {
                        count_v += 1
                        }
                    }
                else if (cell_id[1] === 9) {
                    if ((grid1[cell_id[0]*10 + (i*10) + cell_id[1]].valeur === null) && (grid1[cell_id[0]*10 + (i*10) + cell_id[1] - 1].valeur === null)) {
                        count_v += 1
                        }
                    }
                }

            if (count_v === ship.size) {
                for (let i=0; i < ship.size; i++) {
                        grid1[cell_id[0]*10 + (i*10) + cell_id[1]].valeur = ship.emo;
                        grid1[cell_id[0]*10 + (i*10) + cell_id[1]].display = ship.emo;
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
        if (count_full === 14) {
            play.style.display = 'block'
        }
        else {
            play.style.display = 'none'
        }
    }

    ChangeCells = () => {
        let cells = document.getElementsByClassName('cell')
        for (let i = 0; i < cells.length; i++) {
            if (cells[i].textContent !== '' && cells[i].textContent !== '🌀') {
                cells[i].style.border = 'none';
                cells[i].style.backgroundColor = 'rgb(78, 74, 74)'
            }
            else {
                cells[i].style.border = '1px solid black'
                cells[i].style.backgroundColor = 'rgb(1, 34, 123)';;
            }
        }
    }


    Display_opp_grid()  {
        
        let opp_grid = document.getElementById("opp-grid")
        opp_grid.style.display = 'block'

        let vs_img = document.getElementById("vs")
        vs_img.style.display = 'block'

        let div_settings = document.getElementById('grid-setting')
        div_settings.style.display = 'none'

        let direction = document.getElementsByName('direction')
        for (let i = 0; i < direction.length; i++) {
            if (direction[i].checked === true) {
                direction[i].checked = false
            }
        }

        let ship = document.getElementsByName('ship')
        for (let i = 0; i < ship.length; i++) {
            if (ship[i].checked === true) {
                ship[i].checked = false
            }
        }

        this.setState({
            selected_ship: [],
            direction: []
        })

    }



    render() {
    return (
        <>
        <div id='main'>
            <div id="grid-setting">
                <div className='ships'>
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
                <div className='dir-aside' onClick={this.SelectDir}>
                    <div className='aside'>
                        <div>Horizontalement</div>
                        <input type="radio" id="1" name="direction" value="h" size={'10px'}/>
                    </div>
                    <div className='aside'>
                        <div >Verticalement</div>
                        <input type="radio" id="2" name="direction" value="v"/>
                    </div>
                </div>
                <div className='content__item'>
                    <button id='play' onClick={() => this.Display_opp_grid()} class="button button--fenrir">
                            <svg aria-hidden="true" class="progress" width="70" height="70" viewBox="0 0 70 70">
                                <path class="progress__circle" d="m35,2.5c17.955803,0 32.5,14.544199 32.5,32.5c0,17.955803 -14.544197,32.5 -32.5,32.5c-17.955803,0 -32.5,-14.544197 -32.5,-32.5c0,-17.955801 14.544197,-32.5 32.5,-32.5z"></path>
                                <path class="progress__path" d="m35,2.5c17.955803,0 32.5,14.544199 32.5,32.5c0,17.955803 -14.544197,32.5 -32.5,32.5c-17.955803,0 -32.5,-14.544197 -32.5,-32.5c0,-17.955801 14.544197,-32.5 32.5,-32.5z" pathLength="1"></path>
                            </svg>
                            <span>Jouer</span>
                    </button>
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
