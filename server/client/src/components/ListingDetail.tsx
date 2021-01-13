import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import history from "../browserHistory";
import { connect } from "react-redux";
import { StoreState } from "../reducers";
import {
    ListingDetail as ListingDetailType,
    fetchListingDetail,
} from "../actions";
import postAdListingImagePlaceHolder from "../img/postAdListingImagePlaceHolder.png";
import defaultProfilePic from "../img/defaultProfilePic.jpg";
import Loading from "./Loading";
import moment from "moment";

interface ListingDetailProps extends ListingDetailType {
    fetchListingDetail(id: number): void;
    listingDetail: any;
    match: any;
}
const ListingDetail: React.FC<ListingDetailProps> = (props) => {
    const [showMore, setShowMore] = useState(false);
    useEffect(() => {
        props.fetchListingDetail(props.match.params.id);
    }, []);

    const renderListingDetail = () => {
        if (!props.listingDetail) {
            return (
                <div className="loadingCenter">
                    <Loading />
                </div>
            );
        } else {
            const {
                listingId,
                title,
                description,
                category,
                image,
                province,
                city,
                street,
                price,
                listingDate,
                firstName,
                lastName,
                memberSince,
                email,
            } = props.listingDetail;

            return (
                <React.Fragment>
                    <div className="listingDetailCategories">
                        <h3>{`${province} > ${city} > ${street} > ${category}`}</h3>
                    </div>
                    <div className="listingDetailTitleAndPriceContainer">
                        <h3 className="listingDetailTitle">{title}</h3>
                        <h3 className="listingDetailPrice">{`$${price}`}</h3>
                    </div>
                    <div className="listingDetailInfoAndContactContainer">
                        <div className="listingDetailContainer">
                            <div className="listingDetailImageContainer">
                                <img
                                    // src={postAdListingImagePlaceHolder}
                                    src={
                                        !image
                                            ? postAdListingImagePlaceHolder
                                            : image
                                    }
                                    onError={(e) => {
                                        e.target.src = postAdListingImagePlaceHolder;
                                    }}
                                    alt="listing"
                                />
                            </div>
                            <div className="listingDetailDescriptionContainer">
                                <div className="listingDescriptionTextWrap">
                                    <h3 className="listingDetailPostedOn">
                                        {`Posted On:  ${moment(
                                            listingDate
                                        ).format("YYYY/MM/DD")}`}
                                    </h3>
                                    <h3 className="locationOfPost">Toronto</h3>
                                    <h3 className="listingDetailDescriptionTitle">
                                        Description
                                    </h3>

                                    <p>{description}</p>
                                </div>
                                <div
                                    className={
                                        showMore
                                            ? ""
                                            : "listingDetailDescriptionFade"
                                    }
                                ></div>
                                <h3
                                    className={
                                        showMore
                                            ? "listingDetailShowMoreTextHide"
                                            : "listingDetailShowMoreText"
                                    }
                                    onClick={() => setShowMore(true)}
                                >
                                    Show More
                                </h3>
                            </div>
                        </div>
                        <div className="listingDetailContactContainer">
                            <div className="listingDetailProfileImageAndNameWrap">
                                <img src={defaultProfilePic} alt="profile" />
                                <h3>
                                    {`${firstName}
                                    ${lastName}`}
                                </h3>
                            </div>
                            <div className="contactAndMemberWrap">
                                <h3>{`Contact at: ${email}`}</h3>
                                <h3>{`Member Since: ${moment(
                                    memberSince
                                ).format("YYYY/MM/DD")} `}</h3>
                            </div>
                        </div>
                    </div>
                </React.Fragment>
            );
        }
    };
    return <React.Fragment>{renderListingDetail()}</React.Fragment>;
};

const mapStateToProps = (state: StoreState) => {
    return { listingDetail: state.listingInfo.data };
};

export default connect(mapStateToProps, { fetchListingDetail })(ListingDetail);
