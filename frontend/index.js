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
    unitContainer.hidden = true
    let unitInfo = document.getElementsByClassName("unit-info")[0]
    unitInfo.hidden = true
    let unitCollection = document.getElementById("unit-collection")
    unitCollection.hidden = true

    condoFormButton.addEventListener('click', (event) => {
        event.preventDefault()
        let address = condoForm.getElementsByClassName("input-text")[0].value
        condoForm.hidden = true
        packageForm.hidden = false
        unitCollection.hidden = false
        unitInfo.hidden = false
        unitContainer.hidden = false

        fetch("http://localhost:3000/condos")
            .then(function(response) {
                return response.json()
            })
            .then(function(condoList) {
                currentCondo = condoList.data.find(obj => obj.attributes.address === address)
                let floorLayout = []

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
                    let packageAdd = packageForm.getElementsByClassName("input-text")[0].value
                    let packageUnit = packageForm.getElementsByClassName("input-text")[1].value
                    let packageCourier = packageForm.getElementsByClassName("input-text")[2].value

                    let newPack = new Package(packageAdd, packageCourier, packageUnit)

                    let configObj = {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Accept": "application/json"
                        },
                        body: JSON.stringify(newPack)
                    }

                    fetch("http://localhost:3000/packages", configObj)
                        .then(function(response) {
                            return response.json();
                        })
                        .then(function(package) {
                            let newPackageUnit = package.included[0].attributes
                            let foundUnit = allUnits.find(unit => unit.number === newPackageUnit.number)
                            if(!foundUnit) {
                                let newUnit = new Unit(newPackageUnit.number)
                                allUnits.push(newUnit)

                                let floorDivs = unitContainer.getElementsByClassName("unit-floor")
                                let floors = []
                                for(let i = 0; i < floorDivs.length; i++) {
                                    floors.push(floorDivs[i])
                                }
                                
                                let currentFloorDiv = floors.find(f => f.id === newPackageUnit.number.charAt(0))
                                if(!currentFloorDiv) {
                                    for(let i = 1; i <= (newUnit.number.charAt(0) - floors.slice(-1)[0].id); i++) {
                                        let floorContainer = document.createElement("div")
                                        floorContainer.className = "unit-floor"
                                        floorContainer.id = floors.slice(-1)[0].id + i
                                        floorContainer.hidden = true
                                        unitContainer.appendChild(floorContainer)
                                        currentFloorDiv = floorContainer
                                    }
                                    floorLayout[currentFloorDiv.id] = []
                                }

                                floorLayout[currentFloorDiv.id].push(newUnit)

                                currentFloorDiv.innerHTML = ""
                                let floorLabel = document.createElement("p")
                                floorLabel.innerText = `${currentFloorDiv.id}-FLOOR`
                                floorLabel.className = "floor-label"
                                currentFloorDiv.appendChild(floorLabel)

                                floorLayout[currentFloorDiv.id].sort((a, b) => a.number - b.number)
                                for(let i = 0; i < floorLayout[currentFloorDiv.id].length; i++) {
                                    let unitButton = document.createElement("button")
                                    unitButton.innerHTML = floorLayout[currentFloorDiv.id][i].number
                                    unitButton.className = "unit"
                                    unitButton.id = floorLayout[currentFloorDiv.id][i].number
                                    currentFloorDiv.appendChild(unitButton)
                                    
                                    unitButton.addEventListener('click', (event) => {
                                    })
                                }
                            }
                        })
                })

                fetch("http://localhost:3000/units")
                    .then(function(response) {
                        return response.json()
                    })
                    .then(function(unitList) {
                        units = unitList.data.filter(unit => unit.relationships.condo.data.id === currentCondo.id)
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
                            floorContainer.hidden = true
                            unitContainer.appendChild(floorContainer)

                            let floorLabel = document.createElement("p")
                            floorLabel.innerText = `${i}-FLOOR`
                            floorLabel.className = "floor-label"
                            floorContainer.appendChild(floorLabel)

                            if(!!floorLayout[i]) {
                                floorLayout[i].sort((a, b) => a.number - b.number)
                                for(let j = 0; j < floorLayout[i].length; j++) {
                                    floorContainer.hidden = false
                                    let unitButton = document.createElement("button")
                                    unitButton.innerHTML = floorLayout[i][j].number
                                    unitButton.className = "unit"
                                    unitButton.id = floorLayout[i][j].number
                                    floorContainer.appendChild(unitButton)

                                    unitButton.addEventListener('click', (event) => {
                                        //make function for unit button show
                                    })
                                }
                            }
                        }
                    })
            })
    })
});