import React from 'react'
import Page from 'components/Page'
import moment from 'moment'

import {Radio, Table} from 'react-bootstrap'
import {Link} from 'react-router'

import RadioGroup from 'components/RadioGroup'
import Breadcrumbs from 'components/Breadcrumbs'

import API from 'api'
import {Report, Person} from 'models'

const FORMAT_EXSUM = 'exsum'
const FORMAT_TABLE = 'table'

export default class Search extends Page {
	constructor(props) {
		super(props)
		this.state = {
			query: props.location.query.q,
			viewFormat: FORMAT_TABLE,
			results: {
				reports: [],
				people: [],
			}
		}

		this.changeViewFormat = this.changeViewFormat.bind(this)
	}

	fetchData(props) {
		let query = props.location.query.q
		this.setState({query})
		API.fetch(`/api/search/?q=${query}`).then(results => {
			this.setState({results: {
				reports: results.reports || [],
				people: results.people || [],
				positions: results.positions || [],
				poams: results.poams || [],
				locations: results.locations || [],
			}})
		})
	}

	static pageProps = {
		navElement:
			<div>
				<Link to="/">&lt; Return to previous page</Link>

				<RadioGroup vertical size="large" style={{width: '100%'}}>
					<Radio value="all">Everything</Radio>
					<Radio value="reports">Reports</Radio>
					<Radio value="people">People</Radio>
					<Radio value="positions">Positions</Radio>
					<Radio value="locations">Locations</Radio>
					<Radio value="organizations">Organizations</Radio>
				</RadioGroup>
			</div>
	}

	render() {
		return (
			<div>
				<Breadcrumbs items={[['Searching for "' + this.state.query + '"', '/search']]} />

				{this.state.results.reports.length > 0 &&
				<fieldset>
					<legend>
						Reports
						<RadioGroup value={this.state.viewFormat} onChange={this.changeViewFormat} className="pull-right">
							<Radio value={FORMAT_EXSUM}>EXSUM</Radio>
							<Radio value={FORMAT_TABLE}>Table</Radio>
						</RadioGroup>
					</legend>
					{this.state.viewFormat === FORMAT_TABLE ? this.renderTable() : this.renderExsums()}
				</fieldset>
				}

				{this.state.results.people.length > 0 &&
					<fieldset>
						<legend>People</legend>
						{this.renderPeople()}
					</fieldset>
				}
			</div>
		)
	}

	renderTable() {
		return <Table responsive hover striped>
			<thead>
				<tr>
					<th>Date</th>
					<th>AO</th>
					<th>Summary</th>
				</tr>
			</thead>
			<tbody>
				{Report.map(this.state.results.reports, report =>
					<tr key={report.id}>
						<td><LinkTo report={report}>{moment(report.engagementDate).format('L')}</LinkTo></td>
						<td>TODO</td>
						<td>{report.intent}</td>
					</tr>
				)}
			</tbody>
		</Table>
	}

	renderExsums() {
		return <ul>
			{Report.map(this.state.results.reports, report => {
				let author = report.author || {}
				let attendees = report.attendees || []
				return (
					<li key={report.id}>
						<LinkTo report={report}>Report #{report.id}</LinkTo><br />
						At {moment(report.engagementDate).format('L LT')}, {author.rank} {author.name}
						met with {attendees.length} Afghan principals. They discussed {report.intent}.
						THIS IS AN IMPROPERLY FORMATTED EXSUM.
					</li>
				)
			})}
		</ul>
	}

	renderPeople() {
		return <Table responsive hover striped>
			<thead>
				<tr>
					<th>Name</th>
					<th>Role</th>
					<th>Phone</th>
					<th>Email</th>
				</tr>
			</thead>
			<tbody>
				{Person.map(this.state.results.people, person =>
					<tr key={person.id}>
						<td><LinkTo person={person}>{person.rank} {person.name}</LinkTo></td>
						<td>{person.role}</td>
						<td>{person.phoneNumber}</td>
						<td>{person.emailAddress}</td>
					</tr>
				)}
			</tbody>
		</Table>
	}

	changeViewFormat(newFormat) {
		this.setState({viewFormat: newFormat})
	}
}
