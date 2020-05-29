**Register**
----
> Registers the new user in the database

* **URL**

    /api/register

* **Method**

    `POST`

* **Data Params**

    **Required:**

    `user_name=[string]` <br />
    `password=[string]` <br />
    `email=[string]`

* **Success Response**

    * **Code:** 200

* **Error Response**

    * **Code:** 400 <br />
      **Content:** `{ error: { message: "Username or email is already in use" } }`

* **Sample Call**

    ```
    fetch(
        '/api/register', 
        {
            method: 'POST',
            body: JSON.stringify({
                user_name: 'userName',
                password: 'password',
                email: 'userName@email.com'
            }),
            headers: {
                "Content-Type": "application/json"
            }
        }
    );
    ```