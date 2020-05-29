**Posts**
----
> Fetches post for current forum, adds a new forum, and removes forums

* **URL**

    * `/api/posts/:forum_id`
    * `/api/posts/remove_post/:post_id`

* **Methods**

    * `GET`
    * `POST`
    * `DELETE`

* **Data Params**

    * `user_id=[int]`
    * `token=[JWT]`
    * `forum_id=[int]`
    * `post_id=[int]`
    * `content=[string]`
    * `time_submitted=[string]`

* **Success Response**

    * **Code:** 200 <br />
      **Content:** List of posts <br />

* **Error Response**

    * **Code:** 400

    * **Code:** 401

    * **Code:** 404

* **Sample Call**

    ```
    fetch(
        '/api/posts/:forum_id',
        {
            method: 'GET'
        }
    )
    ```

    ```
    fetch(
        '/api/posts/:forum_id',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'user_id': //your user ID,
                'Cookies': [token]
            },
            body: {
                JSON.stringify({
                    content: [string],
                    time_submitted: [string]
                })
            }
        }
    )
    ```

    ```
    fetch(
        '/api/posts/remove_post/:post_id',
        {
            method: 'DELETE',
            headers: {
                'Cookies': [token]
            }
        }
    )
    ```