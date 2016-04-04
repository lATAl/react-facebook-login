import React, { PropTypes } from 'react';
import styles from '../styles/facebook.scss';
import Icon from 'react-fa';

class FacebookLogin extends React.Component {

  static propTypes = {
    callback: PropTypes.func.isRequired,
    appId: PropTypes.string.isRequired,
    xfbml: PropTypes.bool,
    cookie: PropTypes.bool,
    scope: PropTypes.string,
    textButton: PropTypes.string,
    autoLoad: PropTypes.bool,
    size: PropTypes.string,
    fields: PropTypes.string,
    cssClass: PropTypes.string,
    version: PropTypes.string,
    // icon: PropTypes.string,
    language: PropTypes.string,
  };

  static defaultProps = {
    textButton: 'Login with Facebook',
    scope: 'public_profile, email',
    xfbml: false,
    cookie: false,
    size: 'metro',
    fields: 'name',
    cssClass: 'kep-login-facebook',
    version: '2.3',
    language: 'en_US'
  };

  constructor(props) {
    super(props);

    this.state = {
      isFetching: false,
      isLoggedIn: false
    };
  }

  componentDidMount() {
    let fbRoot = document.createElement('div');
        fbRoot.id = 'fb-root';

    document.body.appendChild(fbRoot);

    window.fbAsyncInit = () => {
      FB.init({
        appId: this.props.appId,
        xfbml: this.props.xfbml,
        cookie: this.props.cookie,
        version: 'v' + this.props.version,
      });

      if (this.props.autoLoad) {
        FB.getLoginStatus(this.checkLoginState);
      }
    };

    // Load the SDK asynchronously
    ((d, s, id) => {
      const element = d.getElementsByTagName(s)[0];
      const fjs = element;
      let js = element;
      if (d.getElementById(id)) {return;}
      js = d.createElement(s); js.id = id;
      js.src = '//connect.facebook.net/' + this.props.language + '/sdk.js';
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
  }

  responseApi = (authResponse) => {
    FB.api('/me', { fields: this.props.fields }, (me) => {
      this.setState({isFetching: true});
      this.setState({isLoggedIn: true});
      me.accessToken = authResponse.accessToken;
      this.props.callback(me);
    });
  };

  checkLoginState = (response) => {
    if (response.authResponse) {
      this.setState({isFetching: true});
      this.setState({isLoggedIn: false});
      this.responseApi(response.authResponse);
    } else {
      if (this.props.callback) {
        this.setState({isFetching: false});
        this.setState({isLoggedIn: false});
        this.props.callback({ status: response.status });
      }
    }
  };

  click = () => {
    this.setState({isLoggedIn: false});
    this.setState({ isFetching: true});
    FB.login(this.checkLoginState, { scope: this.props.scope });
  };

  // renderWithFontAwesome() {
  //   return (
  //     <div>
  //       <link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css" />
  //        <button
  //           className={this.props.cssClass + ' ' + this.props.size}
  //           onClick={this.click}>
  //         <i className={'fa ' + this.props.icon}></i> {this.props.textButton}
  //       </button>
  //
  //       <style dangerouslySetInnerHTML={{ __html: styles }}></style>
  //     </div>
  //   )
  // }

  render() {
    // if (this.props.icon) {
    //   return this.renderWithFontAwesome();
    // }

    // var iconValue = this.props.isFetching == true ?

    var iconFetching;
    var textLogin;

    if (this.state.isFetching) {
      iconFetching = <Icon spin name="spinner" />;
    } else {
      iconFetching = <Icon name="facebook" />;
    }

    if (this.state.isLoggedIn) {
      textLogin = "Logging In...";
    } else {
      textLogin = this.props.textButton;
    }

    return (
      <div>
        <button
            className={this.props.cssClass + ' ' + this.props.size}
            onClick={this.click}>
          {iconFetching} {textLogin}
        </button>

        <style dangerouslySetInnerHTML={{ __html: styles }}></style>
      </div>
    );
  }
}

export default FacebookLogin;
