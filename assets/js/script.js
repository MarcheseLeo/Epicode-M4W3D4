const searchInput = document.getElementById('search')
const dropdown = document.querySelector('.dropdown-menu')
const dropdownToggle = document.querySelector('.dropdown-toggle')
const container = document.getElementById('table-container')
const getUsers = async () => {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users')
        return await response.json()
    } catch (e) {
        console.log(e)
    }
}

const renderUsers = async () => {
    const users = await getUsers()
    console.log(users)

    dropdown.addEventListener('click', (e) => {
        dropdownToggle.textContent = e.target.textContent
        searchInput.setAttribute('placeholder', e.target.textContent)
    })

    searchInput.addEventListener('input', (e) => {
        e.preventDefault()
        if (dropdownToggle.textContent === 'Choose One')
            showAlert('danger','Devi scegliere un campo')
        else {
            const key = dropdownToggle.textContent.toLocaleLowerCase()
            const input = searchInput.value.toLocaleLowerCase()
            const filter = users.filter((user)=>{
                if(user[key].toLowerCase().startsWith(input))
                    return user
            })

            if(filter.length===0){
                clearTable()
                showAlert('warning','Nessun utente trovato')
            }else{
                document.getElementById('table-container').innerHTML = generateTable(filter)
            }
        }
    })
}

const showAlert = (type, message) => {
    const alert = document.createElement('div')
    alert.classList.add('alert', `alert-${type}`)
    alert.setAttribute('role', 'alert')
    alert.textContent = message
    document.body.appendChild(alert)
    setTimeout(() => {
        alert.style.animation = 'fadeOut 0.7s 1 forwards'
        setTimeout(() => {
            alert.remove()
        }, 700)
    }, 3000)

}
const generateTable = (users) => {
    return `
        <table class="table">
            <thead>
                <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Username</th>
                    <th scope="col">Email</th>
                    <th scope="col">Phone</th>
                    <th scope="col">Website</th>
                </tr>
            </thead>
            <tbody>
                ${users.reduce((acc, user, index) =>{
                        acc += `
                            <tr>
                                <td class='d-flex'><div  class='user-logo me-3'>${getInitials(user.name)}</div>${user.name}</td>
                                <td>${user.username}</td>
                                <td>${user.email}</td>
                                <td><p class='phone-number'>${user.phone}</p></td>
                                <td><a href='https://${user.website}' class='link-info'>${user.website}</a></td>
                            </tr>
                        `
                        return acc
                    }, '')
                }
            </tbody>
        </table>
    `
}
const getInitials = (fullname) =>{
    return fullname.split(' ').reduce((acc, char, index) => {
        if(index<=1)
            acc+= char[0]
        return acc
    }, '')
}
const clearTable = () =>{
    container.innerHTML = ''
}
renderUsers()

