import React, { 
	Component, 
	Fragment 
}						from 'react';

import { Redirect }		from 'react-router-dom';
import styled			from 'styled-components';
import * as cn			from 'classnames';
import qs				from 'qs';
import Card				from 'react-bootstrap/lib/Card';

import http				from '../../services/http';
import { toCamelCase }	from '../../utils';
import Button			from '../common/Button';
import Input			from '../forms/Input';
import Select			from '../forms/Select';
import Modal			from '../common/Modal';
import Pagination		from '../common/Pagination';
import Tasklist			from './Tasklist';

export default class TasklistIndex extends Component {
	static Styled = styled.div`
		& > * {
			flex-basis	: 300px;
			margin		: 0.5rem;

			&:hover { cursor: pointer; }

			.card {
				& > .card-body { font-size: 0.8rem; }
			}
		}
	
		.task {
			&.done { text-decoration: line-through; }
		}`;

	constructor(props) {
		super(props);
		
		this.state = {
			data				: [],
			newTasklist			: null,
			selectedTasklistIdx	: null,
			deleting			: false,
			deleted				: false,
			page				: 1,
			paginationMeta		: {
				perPage		: 3,
				lastPage	: 1
			}
		};

		this.pageSizes = [3, 6, 9, 12, 15];
	}
	
	render() {
		const { data, newTasklist, selectedTasklistIdx, redirect, deleting, page, paginationMeta } = this.state;

		return (
			<Fragment>			
				{redirect && <Redirect to={`/tasklist/${newTasklist.id}`}/>}

				<Card className="mb-3">
					<Card.Header className="d-flex justify-content-end">
						{paginationMeta.total > this.pageSizes[0] && <div style={{ flexBasis: '50%' }}>
							<Select
								label			= "Items per page" 
								className		= "mb-0" 
								style			= {{ width: '80px' }}
								value			= {paginationMeta.perPage}
								values			= {this.pageSizes}
								containerClass	= "mb-0"
								onChange		= {e => this.getTasklists(1, e.target.value)}
								horizontal 
								hidePlaceholder
							/>
						</div>}

						<div className="text-right" style={{ flexBasis: '50%' }}>
						{newTasklist? (
							<Input 
								value			= {newTasklist.name}
								placeholder		= "Enter the tasklist name" 
								containerClass	= "mb-0 d-inline-block" 
								style			= {{ width: '300px' }} 
								onKeyUp			= {this.createTasklistKeyUpHandler.bind(this)}
								onChange		= {e => this.setState({ newTasklist: { name: e.target.value } })}
								onBlur			= {() => this.setState({ newTasklist: null })} 
								autoFocus 
							/>
						) : (
							<Button 
								variant	= "primary" 
								label	= "Add New" 
								icon	= "plus" 
								onClick	= {() => this.setState({ newTasklist: { name: '' } })} 
							/>
						)}
						</div>
					</Card.Header>
				</Card>

				<div className={cn('bg-dark text-white', { 'd-flex align-items-center justify-content-center': !data.length })} style={{ minHeight: '600px' }}>
					<div className="p-5">
						<Pagination
							bg				= "dark" 
							currentPage		= {page} 
							onChangePage	= {this.changePageHandler.bind(this)}
							showMeta 
							{...paginationMeta} 
						/>

						<TasklistIndex.Styled className="d-flex flex-wrap justify-content-start">
							{data.map((tl, idx) => (
								<Tasklist
									key			= {idx}
									tasklist	= {tl}
									className	= {this.state.hoveredCard === tl.id ? 'bg-primary text-light' : 'text-dark'} 
									onDelete	= {this.deleteHandler.bind(this, idx)}
									onMouseOver	= {this.mouseOverHandler.bind(this, tl.id)}
									onMouseOut	= {this.mouseOutHandler.bind(this)} 
								/>
							))}

							{!data.length && <p>You haven't created any list yet.</p>}
						</TasklistIndex.Styled>

						<Pagination bottom bg="dark" showMeta currentPage={page} {...paginationMeta} onChangePage={this.changePageHandler.bind(this)} />
					</div>
				</div>

				{deleting && (
					<Modal
						type				= "confirmDelete"
						text				= "Are you sure you want to delete this list?"
                    	successText			= "You have successfully deleted selected list"
                    	onConfirm			= {this.confirmDeleteHandler.bind(this, data[selectedTasklistIdx])}
                    	onConfirmConfirm	= {() => this.setState({ selectedTask: null, deleting: false })}
                    	onCancel			= {() => this.setState({ deleting: false })}
					/>
				)}
			</Fragment>
		);
	}
	
	componentDidMount() {
		this.getTasklists();
	}

	componentWillUpdate(prevProps, prevState) {
		if (prevState.newTasklist && typeof prevState.newTasklist.id !== 'undefined') {
			this.setState({ redirect: true });
		}	
	}

	getTasklists(page = this.state.page, perPage = this.state.paginationMeta.perPage) {
		const queryString = qs.stringify({
			page	: page,
			perPage	: perPage
		});

		return http.get(`/tasklists?${queryString}`)
			.then(res => {
				const meta = toCamelCase(res.data.meta);
				const page = meta.currentPage;
				delete meta.currentPage;
				this.setState({
					data: res.data.data,
					page: page,
					paginationMeta: meta
				});
			});
	}

	mouseOverHandler(id) {
		this.setState({ hoveredCard: id });
	}

	mouseOutHandler() {
		this.setState({ hoveredCard: null });
	}

	async createTasklistKeyUpHandler(e) {
		const { newTasklist } = this.state;

		if (e.keyCode === 13 && /^[A-Za-z0-9\pL ]+$/.test(newTasklist.name)) {
			try {
				const res = await http.post('/tasklists', JSON.stringify(newTasklist));

				this.setState({ newTasklist: res.data });
			} catch (err) {}			
		}
	}

	deleteHandler(tasklistIdx) {
		this.setState({ deleting: true, selectedTasklistIdx: tasklistIdx });
	}

	changePageHandler(page) {
		this.getTasklists(page)
			.then(() => {
				this.setState({ page: page });
			});		
	}

	confirmDeleteHandler(tasklist) {
		http.delete(`/tasklists/${tasklist.id}`)
			.then(res => {
				const { data, page } = this.state;
				const shouldSwitchPage = data.length === 1;

				this.getTasklists(
					shouldSwitchPage ? (page - 1) : page
				).then(() => {
					this.setState({ selectedTasklistIdx: null });
				});
			})
			.catch(err => {});
	}
}