**Forums**
----
> Fetches all forums, adds a new forum, and removes forums

* **URL**

    * `/api/forums`
    * `/api/forums/remove_forum/:forum_id`

* **Methods**

    * `GET`
    * `POST`
    * `DELETE`

* **Data Params**

    * `user_id=[int]`
    * `token=[JWT]`
    * `forum_id=[int]`
    * `title=[string]`
    * `blurb=[string]`

* **Success Response**

    * **Code:** 200 <br />
      **Content:** List of forums <br />

* **Error Response**

    * **Code:** 400

    * **Code:** 401

    * **Code:** 404

* **Sample Call**

    * ```
    fetch(
        '/api/forums',
        {
            method: 'GET'
        }
    )
    ```

    * ```
    fetch(
        '/api/forums',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'user_id': //your user ID,
                'Cookies': [token]
            },
            body: {
                JSON.stringify({
                    title: [string],
                    blurb: [string]
                })
            }
        }
    )
    ```

    * ```
    fetch(
        '/api/forums/remove_forum/:forum_id',
        {
            method: 'DELETE',
            headers: {
                'Cookies': [token]
            }
        }
    )
    ```