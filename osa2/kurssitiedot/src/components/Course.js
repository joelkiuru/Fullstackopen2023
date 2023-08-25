import React from 'react'

const Header = (props) => {
    return(
      <h2>{props.course}</h2>
    )
  }
  
  const Total = ({ sum }) => <h3>total of exercises {sum}</h3>
  
  const Part = (props) => {
  
    return (
      <p>
        {props.part.name} {props.part.exercises}
      </p>
    )
  }
  
  const Content = (props) => {
    console.log(props)
    return(
    <>
      {props.parts.map(part => 
        <Part key={part.id} part={part}/>
        )}
    </>
    )
    
  }
  
  const Course = (props) => {
    const values = props.course.parts.map(part => part.exercises)
    console.log(props)
  
    return (
      <>
        <Header course={props.course.name}/>
        <Content parts={props.course.parts}/>
        <Total sum={values.reduce((sum, exercise) => sum + exercise, 0)} />      
      </>  
    )
  }


export default Course