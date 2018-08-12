import React from "react";


// function to create high order component 
export function withStripe(WrappedComponent, publicKey, secretKey, props) {

  // function to request either token or charge based on value given to 'route' parameter
  const request = async (route, key, method, postData) => {
    let dataStr = null
    if (postData) {
      dataStr = Object.keys(postData)
      .map(key => {
        return `${key}=${postData[key]}`;
      })
      .join("&");
    }

    console.log('this is the dataStr ', dataStr)
    
    const response = await fetch(`https://api.stripe.com/v1/${route}`, {
      method: method,
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: dataStr
    });
    return await response.json();
  }; 

  return class extends React.Component {
    postPublic(route, postData) {
      return request(route, publicKey, "POST", postData);
    }

    postSecret(route, postData) {
      return request(route, secretKey, "POST", postData);
    }

    getSecret(route) {
      return request(route, secretKey, 'GET', null);
    }

    render() {
    
      return (
        <WrappedComponent
          postPublic={this.postPublic}
          postSecret={this.postSecret}
          getSecret={this.getSecret}
          refresh={props}
          {...this.props}
        />
      );
    }
  };
}
