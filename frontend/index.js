let currentCondo
let allCondos = []
let allUnits = []
let allPackages = []

class Condo {
    constructor(address) {
        this.address = address
    }
}

class Unit {
    constructor(num, tenantName) {
        this.number = num
        this.tenantName = tenantName
    }
}

class Package {
    constructor(address, courier, unit) {
        this.address = address
        this.courier = courier
        this.unit = unit
    }
}

window.addEventListener('DOMContentLoaded', (event) => {
    let packageForm = document.getElementsByClassName("add-package-form")[0]
    packageForm.hidden = true
    let condoForm = document.getElementsByClassName("condo-form")[0]
    let condoFormButton = condoForm.getElementsByClassName("submit")[0]
    let unitContainer = document.getElementsByClassName("units")[0]

    condoFormButton.addEventListener('click', (event) => {
        event.preventDefault()
        let address = condoForm.getElementsByClassName("input-text")[0].value
        condoForm.hidden = true
        packageForm.hidden = false

        fetch("http://localhost:3000/condos")
            .then(function(response) {
                return response.json()
            })
            .then(function(condoList) {
                currentCondo = condoList.data.find(obj => {return obj.attributes.address === address})
                if(!currentCondo) {
                    let newCondo = new Condo(address)

                    let configObj = {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Accept": "application/json"
                        },
                        body: JSON.stringify(newCondo)
                    }
                    
                    fetch("http://localhost:3000/condos", configObj)
                        .then(function(response) {
                            return response.json();
                        })
                        .then(function(condo) {
                            currentCondo = condo.data
                        })
                }
                let packageFormButton = packageForm.getElementsByClassName("submit")[0]

                packageFormButton.addEventListener('click', (event) => {
                    event.preventDefault()
                    console.log(currentCondo.attributes.address)
                    console.log(currentCondo.id)

                })

                fetch("http://localhost:3000/units")
                    .then(function(response) {
                        return response.json()
                    })
                    .then(function(unitList) {
                        units = unitList.data.filter(unit => unit.relationships.condo.data.id === currentCondo.id)
                        let floorLayout = []
                        units.forEach(unitInfo => {
                            let unit = new Unit(unitInfo.attributes.number, unitInfo.attributes.tenant_name)
                            allUnits.push(unit)
                            if(!Object.keys(floorLayout).includes(unit.number.charAt(0))) {
                                floorLayout[unit.number.charAt(0)] = []
                            }
                            floorLayout[unit.number.charAt(0)].push(unit)
                        })
                        
                        let floors = Object.keys(floorLayout)
                        for(let i = 0; i <= floors.slice(-1)[0]; i++) {
                            let floorContainer = document.createElement("div")
                            floorContainer.className = "unit-floor"
                            floorContainer.id = i
                            unitContainer.appendChild(floorContainer)

                            if(!!floorLayout[i]) {
                                floorLayout[i].sort((a, b) => a.number - b.number)
                                for(let j = 0; j < floorLayout[i].length; j++) {
                                    let unitButton = document.createElement("button")
                                    unitButton.innerHTML = floorLayout[i][j].number
                                    floorContainer.appendChild(unitButton)
                                }
                            }
                        }
                    })
            })
    })
});