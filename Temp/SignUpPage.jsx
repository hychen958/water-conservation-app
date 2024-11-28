import React from 'react'
import "./SignUpPage.css"
const SignUpPage = () => {
    return (
        <div id="Water Conservation Tracker App">
            <h1>User Management</h1>
            <form id="userForm">
                <input className='signup-input' type="text" id="name" placeholder="Name" required />
                <input type="email" id="email" placeholder="Email" required />
                <input type="number" id="age" placeholder="Age" required />
                <button type="submit">Add User</button>
            </form>

        </div>

    )
}

export default SignUpPage