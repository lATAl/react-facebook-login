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
    language: PropTypes.string
  };

  static defaultProps = {
    textButton: 'Login with Facebook',
    scope: 'public_profile, email',
    xfbml: false,
    cookie: false,
    size: 'metro',
    fields: 'name',
    cssClass: 'kep-login-facebook',
    version: '2.5',
    language: 'en_US'
  };

  constructor(props) {
    super(props);

    this.state = {
      isFetching: false,
      isLoading: true
    };
  }

  componentDidMount() {
    let fbRoot = document.createElement('div');
        fbRoot.id = 'fb-root';

    document.body.appendChild(fbRoot);

    if (window.FB) {
      this.setState({ isLoading: false });
    } else {
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

        this.setState({ isLoading: false });
      };
    }

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

  checkLoginState = (response) => {
    if (response.authResponse) {
      // this.setState({isFetching: false});
      this.props.callback({success: true, data: response.authResponse});
    } else {
      if (this.props.callback) {
        this.setState({isFetching: false});
        this.props.callback({success: false, data: response.authResponse});
      }
    }
  };

  click = () => {
    this.setState({ isFetching: true});
    FB.login(this.checkLoginState, { scope: this.props.scope });
  };

  render() {
    var iconFetching;
    var textLogin;

    if (this.state.isFetching) {
      iconFetching = <Icon spin name="spinner" />;
      textLogin = "Logging In...";
    } else {
      iconFetching = this.state.isLoading ? <Icon spin name="spinner" /> : <Icon name="facebook" />;
      textLogin = this.state.isLoading ? 'Loading...' : this.props.textButton;
    }

    var isDisabled = this.state.isLoading ? true : false;

    return (
      <div>
        <button
            disabled={isDisabled}
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
