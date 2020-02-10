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

    condoFormButton.addEventListener('click', (event) => {
        event.preventDefault()
        let address = condoForm.getElementsByClassName("input-text")[0].value
        condoForm.hidden = true
        packageForm.hidden = false
        currentCondo = allCondos.find(obj => {return obj.address === address})
        if(!currentCondo) {
            currentCondo = new Condo(address)
            allCondos.push(currentCondo)

            let configObj = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify(currentCondo)
            }
            
            fetch("http://localhost:3000/condos", configObj)
                .then(function(response) {
                    return response.json();
                })
                .then(function(condo) {
                    currentCondo.id = condo.data.id
                })
        } else {
            fetch(`http://localhost:3000/condos/${currentCondo.id}`)
        }

        
    })
});