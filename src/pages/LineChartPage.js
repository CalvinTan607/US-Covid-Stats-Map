import React from 'react'
import {useState} from 'react'
import axios from 'axios'


import LineChart from '../components/LineChart'
import {Row,Col,Form,Button,Alert,Container} from 'react-bootstrap'

export default function LineChartPage(){
    const [msg,setMsg] = useState('')
    const [chartData,setChartData] = useState('')
    const [error,setError] = useState('')

    const getChartData=(e)=> {
        e.preventDefault()
        const selected = document.getElementById('selectedStateChart')
        const days = document.getElementById('numberOfDaysChart')
        const whichData = document.getElementById('casesOrDeaths')
    
        const whichStat = whichData.value
        const numberOfDays = days.value
        const state = selected.value
    
        var label;
    
        if(whichStat === 'tot_cases')
          label = "Total Cases"
        else 
          label = "Total Deaths"
    
        //check if number is integer
        if(numberOfDays%1!==0){
          setError('Please enter an integer');
          return 
          }
            //limiting the number of days
          else if(numberOfDays>365||numberOfDays<=1){
            setError('Your input must be within the days limit')
            return
          }
          axios.get(`https://data.cdc.gov/resource/9mfq-cb36.json?$limit=${numberOfDays}${state}&$order=submission_date%20DESC`)
          .then(res => {
            console.log(res.data[0])
            const response = res.data.reverse();
            //spliting the time so only the date shows up
            response.map(responses=>{
              const split = responses.submission_date.split("T")
              responses.submission_date=split[0]
            })
            setMsg(`Covid statistics for ${res.data[0].state}`)
            
            setChartData({
              labels:res.data.map((data)=>data.submission_date),
              datasets:[{
                label: label,
                data: res.data.map((data)=>data[`${whichStat}`]),
                backgroundColor:['red'],
              }]
            })
          }).catch(err => {
            console.log(err)
          })
    }
    
    return(
        <div>
    {error
          ? <Alert key = 'danger' variant='danger' onClose={() => setError('')} dismissible> {error}</Alert>
          : null
    }
                <h1 style={{textAlign:"center"}}>Display Data in a Line Chart</h1>
      <Container className='bg-info '>
      <Row> 
      <Col>
      <h3>
          This page displays Covid statistics with a line chart. 
          Good for spotting trends, such as the introduction of the Omnicron variant to the US (December 1, 2021)

      </h3>
      </Col>
      <Col className='m-2'>
      <Form  onSubmit={getChartData}>
        
          <Form.Group  controlId = 'selectedStateChart'>
            <Form.Label className='mb-3'>Select a State</Form.Label>
            <Form.Select  >
              <option value="&state=AL">Alabama</option>
              <option value="&state=AK">Alaska</option>
              <option value="&state=AZ">Arizona</option>
              <option value="&state=AR">Arkansas</option>
              <option value="&state=CA">California</option>
              <option value="&state=CO" >Colorado</option>
              <option value="&state=CT">Connecticut</option>
              <option value="&state=DE">Delaware</option>
              <option value="&state=FL">Florida</option>
              <option value="&state=GA">Georgia</option>
              <option value="&state=HI">Hawaii</option>
              <option value="&state=ID">Idaho</option>
              <option value="&state=IL">Illinois</option>
              <option value="&state=IN">Indiana</option>
              <option value="&state=IA">Iowa</option>
              <option value="&state=KS">Kansas</option>
              <option value="&state=KY">Kentucky</option>
              <option value="&state=LA">Louisana</option>
              <option value="&state=ME">Maine</option>
              <option value="&state=MD">Maryland</option>
              <option value="&state=MA">Massachusetts</option>
              <option value="&state=MI">Michigan</option>
              <option value="&state=MN">Minnesota</option>
              <option value="&state=MS">Mississippi</option>
              <option value="&state=MO">Missouri</option>
              <option value="&state=MT">Montana</option>
              <option value="&state=NE">Nebraska</option>
              <option value="&state=NV">Nevada</option>
              <option value="&state=NH">New Hampshire</option>
              <option value="&state=NJ">New Jersey</option>
              <option value="&state=NM">New Mexico</option>
              <option value="&state=NY">New York</option>
              <option value="&state=NC">North Carolina</option>
              <option value="&state=ND">North Dakota</option>
              <option value="&state=OH">Ohio</option>
              <option value="&state=OK">Oklahoma</option>
              <option value="&state=OR">Oregon</option>
              <option value="&state=PA">Pennsylvania</option>
              <option value="&state=RI">Rhode Island</option>
              <option value="&state=SC">South Carolina</option>
              <option value="&state=SD">South Dakota</option>
              <option value="&state=TN">Tennessee</option>
              <option value="&state=TX">Texas</option>
              <option value="&state=UT">Utah</option>
              <option value="&state=VT">Vermont</option>
              <option value="&state=VA">Virginia</option>
              <option value="&state=WA">Washington</option>
              <option value="&state=WV">West Virginia</option>
              <option value="&state=WI">Wisconsin</option>
              <option value="&state=WY">Wyoming</option>
            </Form.Select>
        </Form.Group>

        <Form.Group controlId ='numberOfDaysChart'>
          <Form.Label className='mb-3'>How many days</Form.Label>
          <Form.Control type = 'input'></Form.Control>
          <Form.Text>Enter an integer between 2 - 365</Form.Text>
        </Form.Group>
  

          <Form.Group controlId = 'casesOrDeaths'>
            <Form.Label className = 'mb-3'>View Cases or Deaths?</Form.Label>
              <Form.Select>
                <option value = "tot_cases">Total Cases</option>
                <option value = "tot_death">Total Deaths</option>
              </Form.Select>
          </Form.Group>

        
        <div style={{display: 'flex', justifyContent: 'center'}}>
        <Button className = 'm-3' type = 'submit' >Submit</Button>
        </div>
        
      </Form>
      </Col>
      </Row>
      </Container>
    
    {
      msg?<h1 style={{textAlign:"center"}}>{msg}</h1> : null
    }

    {/* chart section over here*/}
    {
        chartData 
        ? <LineChart chartData={chartData}/>
        :null
    }
        </div>
    )
}