// SeaORM data-access module: users and sessions persistence.
use sea_orm::*;

pub use crate::entities::sessions::Entity as Sessions;
pub use crate::entities::users::Entity as Users;

pub async fn find_user(db: &DatabaseConnection, id: i32) -> Result<(), DbErr> {
    let _ = Users::find_by_id(id).one(db).await?;
    Ok(())
}

pub async fn create_user(db: &DatabaseConnection) -> Result<(), DbErr> {
    let _ = Users::insert(crate::entities::users::ActiveModel::default())
        .exec(db)
        .await?;
    Ok(())
}

pub async fn create_session(db: &DatabaseConnection) -> Result<(), DbErr> {
    let _ = Sessions::insert(crate::entities::sessions::ActiveModel::default())
        .exec(db)
        .await?;
    Ok(())
}

pub async fn delete_session(db: &DatabaseConnection, id: i32) -> Result<(), DbErr> {
    let _ = Sessions::delete_by_id(id).exec(db).await?;
    Ok(())
}
