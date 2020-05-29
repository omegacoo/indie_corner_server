**Auth/Login**
----
> Log in to an already created account

* **URL**

    /api/auth/login

* **Method**

    `POST`

* **Data Params**

    **Required:**

    `user_name:[string]` <br />
    `password:[string]`

* **Success Response**

    * **Code:** 200

* **Error Response**

    * **Code:** 400 <br />
      **Content:** `{ error: { message: "Missing user_name in request body" } }`

    * **Code:** 400 <br />
      **Content:** `{ error: { message: "Missing password in request body: } }`

* **Sample Call**

    ```
    fetch(
        '/api/auth/login', 
        {
            method: 'POST',
            body: JSON.stringify({
                user_name: 'userName',
                password: 'password'
            }),
            headers: {
                "Content-Type": "application/json"
            }
        }
    );
    ```