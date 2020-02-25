let currentCondo
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
    constructor(address, courier, unit, time, status) {
        this.address = address
        this.courier = courier
        this.unit = unit
        this.delivered = time
        this.claimed = status
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
    let unitForm = document.getElementsByClassName("add-unit-form")[0]

    //unit info show section
    let unitNumTitle = document.getElementById("unit-info-title")
    let unitTenantNameForm = document.getElementById("unit-info-name")
    let unitTenantName = unitTenantNameForm.getElementsByTagName("p")[0]
    let unitTenantBut = unitTenantNameForm.getElementsByClassName("submit")[0]
    let packageContainer = unitInfo.getElementsByClassName("package-container")[0]

    let floorLayout = []

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
                            let newPackageUnitNum = package.included[0].attributes.number
                            let foundUnit = allUnits.find(unit => unit.number === newPackageUnitNum)
                            if(!foundUnit) {
                                addNewUnit(newPackageUnitNum, undefined, package.included[0].id)
                            }
                            newPack.delivered = package.data.attributes.created_at
                            newPack.claimed = package.data.attributes.claimed
                            newPack.id = package.data.id
                            allPackages.push(newPack)
                        })
                })

                let unitFormButton = unitForm.getElementsByClassName("submit")[0]
                unitFormButton.addEventListener('click', (event) => {
                    event.preventDefault()
                    let newUnitNum = unitForm.getElementsByClassName("input-text")[0].value
                    let newUnitTenant = unitForm.getElementsByClassName("input-text")[1].value
                    let newUnitModel = allUnits.find(unit => unit.number === newUnitNum)
                    if(!newUnitModel) {
                        newUnitModel = new Unit(newUnitNum, newUnitTenant)
                        newUnitModel.address = currentCondo.attributes.address

                        let configObj = {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                "Accept": "application/json"
                            },
                            body: JSON.stringify(newUnitModel)
                        }

                        fetch("http://localhost:3000/units", configObj)
                            .then(function(response) {
                                return response.json();
                            })
                            .then(function(unit) {
                                addNewUnit(unit.data.attributes.number, unit.data.attributes.tenant_name, unit.data.id)
                            })
                    } else {
                        console.log("error")
                        //display error saying unit already exists
                    }
                })

                fetch("http://localhost:3000/units")
                    .then(function(response) {
                        return response.json()
                    })
                    .then(function(unitList) {
                        let units = unitList.data.filter(unit => unit.relationships.condo.data.id === currentCondo.id)
                        for(let i = 0; i < units.length; i++) {
                            let unit = new Unit(units[i].attributes.number, units[i].attributes.tenant_name)
                            unit.id = units[i].id
                            allUnits.push(unit)
                            if(!Object.keys(floorLayout).includes(unit.number.charAt(0))) {
                                floorLayout[unit.number.charAt(0)] = []
                            }
                            floorLayout[unit.number.charAt(0)].push(unit)
                        }
                        
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
                                floorContainer.hidden = false
                                for(let j = 0; j < floorLayout[i].length; j++) {
                                    let unitButton = document.createElement("button")
                                    unitButton.innerHTML = floorLayout[i][j].number
                                    unitButton.className = "unit"
                                    unitButton.id = floorLayout[i][j].number
                                    floorContainer.appendChild(unitButton)

                                    unitButton.addEventListener('click', (event) => {
                                        let unit = allUnits.find(unit => unit.number === unitButton.id)
                                        showUnitInfo(unit)
                                    })
                                }
                            }
                        }
                    })
            })
    })
    
    unitTenantBut.addEventListener('click', (event) => {
        event.preventDefault()

        let inputName = document.getElementById("input-unit-info")
        let newTenantName = inputName.value
        let unit = allUnits.find(unit => unit.number === unitNumTitle.innerText.split(" ").slice(-1)[0])
        unit.tenantName = newTenantName

        let configObj = {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(unit)
        }

        fetch(`http://localhost:3000/units/${unit.id}`, configObj)
            .then(function(response) {
                return response.json();
            })
            .then(function(unitInfo) {
                unitTenantName.innerText = newTenantName
                inputName.value = ""
            })
    })

    fetch("http://localhost:3000/packages")
        .then(function(response) {
            return response.json();
        })
        .then(function(packageInfo) {
            let units = packageInfo.included
            for(let i = 0; i < packageInfo.data.length; i++) {
                let pAdd = packageInfo.data[i].attributes.address
                let pCour = packageInfo.data[i].attributes.courier
                
                let unit = units.find(u => u.id === packageInfo.data[i].relationships.unit.data.id)
                let pNum = unit.attributes.number

                let pDel = packageInfo.data[i].attributes.created_at
                let pSta = packageInfo.data[i].attributes.claimed
                let packageModel = new Package(pAdd, pCour, pNum, pDel, pSta)

                packageModel.id = packageInfo.data[i].id

                allPackages.push(packageModel)
            }
        })

    function addNewUnit(unitNum, tenantName, unitId) {
        let newUnit = new Unit(unitNum, tenantName)
        newUnit.id = unitId
        allUnits.push(newUnit)

        let floorDivs = unitContainer.getElementsByClassName("unit-floor")
        let floors = []
        let highestFloorDivId
        if(!floorDivs.length) {
            highestFloorDivId = -1
        } else {
            for(let i = 0; i < floorDivs.length; i++) {
                floors.push(floorDivs[i])
            }
            highestFloorDivId = floors.slice(-1)[0].id
        }
                                
        let currentFloorDiv = floors.find(f => f.id === unitNum.charAt(0))
        if(!currentFloorDiv) {
            for(let i = 1; i <= (newUnit.number.charAt(0) - highestFloorDivId); i++) {
                let floorContainer = document.createElement("div")
                floorContainer.className = "unit-floor"
                floorContainer.id = parseInt(highestFloorDivId) + i
                floorContainer.hidden = true
                unitContainer.appendChild(floorContainer)
                currentFloorDiv = floorContainer
            }
            floorLayout[currentFloorDiv.id] = []
        } else if(currentFloorDiv.hidden) {
            floorLayout[currentFloorDiv.id] = []
        }

        floorLayout[currentFloorDiv.id].push(newUnit)

        currentFloorDiv.innerHTML = ""
        let floorLabel = document.createElement("p")
        floorLabel.innerText = `${currentFloorDiv.id}-FLOOR`
        floorLabel.className = "floor-label"

        currentFloorDiv.appendChild(floorLabel)

        floorLayout[currentFloorDiv.id].sort((a, b) => a.number - b.number)
        currentFloorDiv.hidden = false
        for(let i = 0; i < floorLayout[currentFloorDiv.id].length; i++) {
            let unitButton = document.createElement("button")
            unitButton.innerHTML = floorLayout[currentFloorDiv.id][i].number
            unitButton.className = "unit"
            unitButton.id = floorLayout[currentFloorDiv.id][i].number
            currentFloorDiv.appendChild(unitButton)
                                    
            unitButton.addEventListener('click', (event) => {
                let unit = allUnits.find(unit => unit.number === unitButton.id)
                showUnitInfo(unit)
            })
        }
    }

    function showUnitInfo(unit) {
        packageContainer.innerHTML = ""
        unitNumTitle.innerText = `UNIT ${unit.number}`
        unitNumTitle.hidden = false
        if(!!unit.tenantName) {
            unitTenantName.innerText = unit.tenantName
        } else {
            unitTenantName.innerText = "No Tenant Assigned"
        }
        unitTenantNameForm.hidden = false
        
        let unitPackages = allPackages.filter(package => package.address === currentCondo.attributes.address && package.unit === unit.number)
        let unitPackagesUnclaimed = unitPackages.filter(package => !package.claimed)
        let unitPackagesClaimed = unitPackages.filter(package => package.claimed)
        
        if(unitPackages.length === 0) {
            let packageList = document.createElement("p")
            packageList.innerText = "No Records"
            packageList.style = "margin:15px;font-size:14px;"
            packageContainer.appendChild(packageList)
        } else {
            let claimedPackageList = document.createElement("ul")
            claimedPackageList.className = "packages-claimed"
            let unclaimedPackageList = document.createElement("ul")
            unclaimedPackageList.className = "packages-unclaimed"            

            let unclaimedHeader = document.createElement("p")
            unclaimedHeader.className = "package-header"
            unclaimedHeader.innerText = "UNCLAIMED"
            packageContainer.appendChild(unclaimedHeader)
            packageContainer.appendChild(unclaimedPackageList)

            if(unitPackagesUnclaimed.length !== 0) {
                for(let i = 0; i < unitPackagesUnclaimed.length; i++) {
                    let pkg = document.createElement("li")
                    pkg.id = unitPackagesUnclaimed[i].id
                    pkg.className = "package"
                    pkg.innerText = `Delivery Date: ${unitPackagesUnclaimed[i].delivered.split("T").slice(0, 1)[0]}\n` +
                                    `Time: ${unitPackagesUnclaimed[i].delivered.split("T").slice(1)[0].slice(0, 5)}\n` +
                                    `Courier: ${unitPackagesUnclaimed[i].courier}`
                    unclaimedPackageList.appendChild(pkg)

                    pkg.addEventListener('click', (event) => {
                        unitPackagesUnclaimed[i].claimed = true

                        let configObj = {
                            method: "PATCH",
                            headers: {
                                "Content-Type": "application/json",
                                "Accept": "application/json"
                            },
                            body: JSON.stringify(unitPackagesUnclaimed[i])
                        }

                        fetch(`http://localhost:3000/packages/${unitPackagesUnclaimed[i].id}`, configObj)
                            .then(function(response) {
                                return response.json();
                            })
                            .then(function(packageInfo) {
                            })
                        
                        unclaimedPackageList.removeChild(pkg)
                        let newPkg = document.createElement("li")
                        newPkg.id = pkg.id
                        newPkg.className = pkg.className
                        newPkg.innerText = `Delivery Date: ${unitPackagesUnclaimed[i].delivered.split("T").slice(0, 1)[0]}\n` +
                                           `Time: ${unitPackagesUnclaimed[i].delivered.split("T").slice(1)[0].slice(0, 5)}\n` +
                                           `Courier: ${unitPackagesUnclaimed[i].courier}`
                        claimedPackageList.appendChild(newPkg)
                    })
                }
            }

            let claimedHeader = document.createElement("p")
            claimedHeader.className = "package-header"
            claimedHeader.innerText = "CLAIMED"
            packageContainer.appendChild(claimedHeader)
            packageContainer.appendChild(claimedPackageList)

            if(unitPackagesClaimed.length !== 0) {
                
                for(let i = 0; i < unitPackagesClaimed.length; i++) {
                    let pkg = document.createElement("li")
                    pkg.id = unitPackagesClaimed[i].id
                    pkg.className = "package"
                    pkg.innerText = `Delivery Date: ${unitPackagesClaimed[i].delivered.split("T").slice(0, 1)[0]}\n` +
                                    `Time: ${unitPackagesClaimed[i].delivered.split("T").slice(1)[0].slice(0, 5)}\n` +
                                    `Courier: ${unitPackagesClaimed[i].courier}`
                    claimedPackageList.appendChild(pkg)
                }
            }
        }
    }
});