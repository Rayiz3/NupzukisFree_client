import { Route } from '@solidjs/router'
import MainPage from './MainPage'
import LoginPage from './LoginPage'
import SignupPage from './SignupPage'
import MycontentPage from './MycontentPage'
import WorkplacePage from './WorkplacePage'
import PlayPage from './PlayPage'


const Pages = () => {
  return (
    <>
        <Route path="/" component={MainPage} />
        <Route path="/login" component={LoginPage} />
        <Route path="/signup" component={SignupPage} />
        <Route path="/mycontent" component={MycontentPage} />
        <Route path="/workplace" component={WorkplacePage} />
        <Route path="/play" component={PlayPage} />
    </>
  )
}

export default Pages