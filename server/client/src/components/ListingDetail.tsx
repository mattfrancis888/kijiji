import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import history from "../browserHistory";
import { connect } from "react-redux";
import { StoreState } from "../reducers";
import {
    ListingDetail as ListingDetailType,
    fetchListingDetail,
    ServerError,
} from "../actions";
import postAdListingImagePlaceHolder from "../img/postAdListingImagePlaceHolder.png";
import defaultProfilePic from "../img/defaultProfilePic.jpg";
import Loading from "./Loading";
import moment from "moment";

interface ListingDetailProps {
    fetchListingDetail(listingId: string): void;
    listingDetail: ListingDetailType;
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
            //too lazy to fix ts error, but I get the idea
        } else if (props.listingDetail.error) {
            return (
                <div className="serverErrorContainer">
                    <h3 className="serverErrorText">
                        {props.listingDetail.error}
                    </h3>
                </div>
            );
        } else {
            const {
                first_name,
                last_name,
                member_since,
                email,
                listing_id,
                listing_name,
                listing_price,
                listing_description,
                category_name,
                listing_image,
                province,
                city,
                street,
                listing_date,
            } = props.listingDetail;

            return (
                <React.Fragment>
                    <div className="listingDetailCategories">
                        <h3>{`${province} > ${city} > ${street} > ${category_name}`}</h3>
                    </div>
                    <div className="listingDetailTitleAndPriceContainer">
                        <h3 className="listingDetailTitle">{listing_name}</h3>
                        <h3 className="listingDetailPrice">{`$${listing_price}`}</h3>
                    </div>
                    <div className="listingDetailInfoAndContactContainer">
                        <div className="listingDetailContainer">
                            <div className="listingDetailImageContainer">
                                <img
                                    // src={postAdListingImagePlaceHolder}
                                    src={
                                        !listing_image
                                            ? postAdListingImagePlaceHolder
                                            : listing_image
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
                                            listing_date
                                        ).format("YYYY/MM/DD")}`}
                                    </h3>
                                    <h3 className="locationOfPost">{`${province}, ${city}, ${street}`}</h3>
                                    <h3 className="listingDetailDescriptionTitle">
                                        Description
                                    </h3>

                                    <p>{listing_description}</p>
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
                                    {`${first_name}
                                    ${last_name}`}
                                </h3>
                            </div>
                            <div className="contactAndMemberWrap">
                                <h3>{`Contact at: ${email}`}</h3>
                                <h3>{`Member Since: ${moment(
                                    member_since
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
