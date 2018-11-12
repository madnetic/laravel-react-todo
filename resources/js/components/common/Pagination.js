import React, {
    Component, 
    Fragment 
}                   from 'react';
import PropTypes    from 'prop-types';

import * as cn      from 'classnames';
import styled       from 'styled-components';

import { 
    unsignedNonZeroInteger, 
    unsignedInteger 
}                   from '../../validation/props';

const bsPaginationSizes = ['lg', 'sm'];

export default class Pagination extends Component {
    static propTypes = {
        centered        : PropTypes.bool,
        top             : PropTypes.bool,
        bottom          : PropTypes.bool,
        size            : PropTypes.oneOf(bsPaginationSizes),
        bg              : PropTypes.oneOf(['dark']),
        showMeta        : PropTypes.bool,
        metaPosition    : PropTypes.oneOf(['left', 'right']),
        currentPage     : unsignedNonZeroInteger,
        perPage         : unsignedNonZeroInteger,
        total           : unsignedInteger,
        from            : unsignedNonZeroInteger,
        lastPage        : unsignedNonZeroInteger,
        onChangePage    : PropTypes.func.isRequired
    };

    static defaultProps = {
        centered        : true,
        top             : true,
        bottom          : false,
        size            : null,
        bg              : null,
        showMeta        : false,
        metaPosition    : 'right',
        currentPage     : 1,
        perPage         : null,
        total           : null,
        from            : null,
        lastPage        : null,
        onChangePage    : () => {}
    };

    static Li = styled.li`
        display: inline-block;
        ${(props => props.bg  === 'dark' ? `
            margin-right: 2px;

            .page-link {
                border: 0;
            }

            &:not(.active) {
                .page-link { background-color: #1d2124 !important; }
            }

            &.active {
                .page-link { background-color: black; }
            }

            &:not([disabled]) {
                &:hover { background-color: black !important; }
            }

            &[disabled] { opacity: 0.5; }` : '')}`;

    static Nav = styled.nav`
        text-align: center;

        @media screen and (min-width: 992px) {
            .pagination-meta { position: absolute !important; }
        }`;

    static PageItem = props => {
        const { bg, currentPage, pageLinkClass, onChangePage, page, icon, ariaLabel, disabled, ...rest } = props;

        return (
            <Pagination.Li bg={bg} className={cn('page-item', { active: page == currentPage && !icon, disabled: disabled })} {...rest}>
                <a className    = {cn('page-link', { [pageLinkClass]: pageLinkClass })}
                   aria-label   = {ariaLabel} 
                   onClick      = {() => !disabled && onChangePage(page)}>
                    {icon ? (
                        <Fragment>
                            <i aria-hidden className={`fa fa-${icon}`}></i>
                            {ariaLabel && 
                                <span className="sr-only">{ariaLabel}</span>}
                        </Fragment>
                    ) : page}
                </a>
            </Pagination.Li>
        );
    }

    static Prev     = props => <Pagination.PageItem {...props} icon="caret-left" ariaLabel="Previous page" />;
    static Next     = props => <Pagination.PageItem {...props} icon="caret-right" ariaLabel="Next page" />;
    static First    = props => <Pagination.PageItem {...props} icon="backward" ariaLabel="First page" page={1} {...props} />;
    static Last     = props => <Pagination.PageItem {...props} icon="forward" ariaLabel="Last page" />;
    static Ellipsis = props => <Pagination.PageItem {...props} disabled page="..." />;

    static Meta = ({ from, to, total, position }) => (
        <div className  = {cn('pagination-meta d-lg-flex mt-lg-0 align-items-center', { 'mt-4': position !== 'left', 'mb-3': position === 'left' })}
             style      = {{ height: '100%', [position]: 0}}>
             <span>{(from === to ? `Showing item ${from} of ${total}` : `Showing items ${from}-${to} of ${total}`)}</span>                            
        </div>
    )

    render() {
        const { centered, top, bottom, size, bg, showMeta, metaPosition, currentPage, perPage, total, from, lastPage, onChangePage, ...props } = this.props;

        const meta = <Pagination.Meta from={from} to={this.to} total={total} position={metaPosition} />

        return lastPage > 1 ? (
            <Pagination.Nav
                aria-label  = "Pagination" 
                className   = {cn('d-lg-flex position-relative', { 'justify-content-center': centered, 'mb-3': top, 'mt-3': bottom })} 
                {...props}>
                
                {showMeta && metaPosition === 'left' && meta}
                
                <ul className={cn('pagination mb-0', { [`pagination-${size}`]: size })} style={{ display: 'inline-block' }}>
                    
                    <Pagination.First {...this.props}
                        disabled={this.isFirstPage()} />

                    <Pagination.Prev {...this.props}
                        disabled={this.isFirstPage()} 
                        page={!this.isFirstPage() && (currentPage - 1)} />

                    {currentPage > 2 && currentPage === lastPage && 
                        <Pagination.PageItem {...this.props} page={currentPage - 2} />}

                    {currentPage > 1 && 
                        <Pagination.PageItem {...this.props} page={currentPage - 1} />}

                    <Pagination.PageItem {...this.props} page={currentPage} />

                    {lastPage > (currentPage + 1) && 
                        <Pagination.PageItem {...this.props} page={currentPage + 1} />}
                    
                    {lastPage > (currentPage + 2) && 
                        <Pagination.Ellipsis {...this.props}/>}
                    
                    {lastPage !== currentPage && 
                        <Pagination.PageItem {...this.props} page={lastPage} />}
                    
                    <Pagination.Next {...this.props} 
                        disabled={this.isLastPage()} 
                        page={!this.isLastPage() && (this.props.currentPage + 1)} />
                    
                    <Pagination.Last {...this.props} 
                        disabled={this.isLastPage()} 
                        page={lastPage} />

                </ul>

                {showMeta && metaPosition === 'right' && meta}

            </Pagination.Nav>
        ) : null;
    }

    get to() {
        const { from, total, perPage } = this.props;
        const to = from + perPage - 1;
        
        return to <= total ? to : total;
    }

    isFirstPage() {
        return this.props.currentPage === 1;
    }

    isLastPage() {
        return this.props.currentPage === this.props.lastPage;
    }
}
