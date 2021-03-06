import React, {Component} from 'react';
import DishDetail from './DishDetailComponent';
import Menu from './MenuComponent';
import Header from "./HeaderComponent";
import Footer from "./FooterComponent";
import Home from "./HomeComponent"
import { Redirect, Route, Switch, withRouter } from 'react-router-dom';
import Contact from "./ContactComponent";
import About from "./AboutComponent";
import {connect} from "react-redux";
import {addComment, fetchDishes} from "../Redux/ActionCreators";


const mapStateToProps = state =>{
    return({
        dishes: state.dishes,
        comments: state.comments,
        leaders: state.leaders,
        promotions: state.promotions
    })
};

const mapDispatchToProps = (dispatch) => ({
    addComment:  (dishId, rating, author, comment)=> dispatch(addComment(dishId, rating, author, comment)),
    fetchDishes: ()=> dispatch(fetchDishes())
})


class Main extends Component{
    constructor(props){
        super(props);
    }

    componentDidMount(){
        this.props.fetchDishes();
    }

    render(){
        const DishAtId = ({match})=>{
            return(
                <DishDetail selectedDish={this.props.dishes.dishes.filter((dish)=> dish.id === parseInt(match.params.dishId, 10))[0]}
                            dishesLoading = {this.props.dishes.isLoading}
                            dishesErrMess = {this.props.dishes.errMess}
                            comments = {this.props.comments.filter((comment)=> comment.dishId === parseInt(match.params.dishId, 10))}
                            addComment = {this.props.addComment}/>
            );
        }; 

        const HomePage = ()=> {
            return(
                <Home dish={this.props.dishes.dishes.filter((dish)=> dish.featured)[0]}
                        dishesLoading = {this.props.dishes.isLoading}
                        dishesErrMess = {this.props.dishes.errMess}
                        leader={this.props.leaders.filter((leader)=> leader.featured)[0]}
                        promotion={this.props.promotions.filter((promo)=> promo.featured)[0]}/>
            );
        };

        const AboutPage = ()=> {
            return(
                <About leaders={this.props.leaders}/>
            );
        }
        
        return(
            <div>
                <Header />
                <Switch>
                    <Route path = "/home" component={HomePage} />
                    <Route path ="/aboutus" component = {AboutPage} />
                    <Route exact path="/menu" component={()=> <Menu dishes= {this.props.dishes}/>}/>
                    <Route exact path="/contactus" component={Contact}/>
                    <Route path="/menu/:dishId" component={DishAtId}/>
                    <Redirect to="/home" />
                </Switch>
                <Footer />
            </div>
        );
    }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Main));