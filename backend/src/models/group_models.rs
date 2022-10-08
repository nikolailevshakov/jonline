use std::time::SystemTime;

use crate::schema::groups;
use crate::schema::memberships;

#[derive(Debug, Queryable, Identifiable, AsChangeset)]
pub struct Group {
    pub id: i32,
    pub name: String,
    pub description: Option<String>,
    pub avatar: Option<Vec<u8>>,
    pub visibility: String,
    pub default_membership_permissions: serde_json::Value,
    pub default_membership_moderation: String,
    pub created_at: SystemTime,
    pub updated_at: SystemTime,
}

#[derive(Debug, Insertable)]
#[table_name = "groups"]
pub struct NewGroup {
    pub name: String,
    pub description: Option<String>,
    pub avatar: Option<Vec<u8>>,
    pub visibility: String,
    pub default_membership_permissions: serde_json::Value,
    pub default_membership_moderation: String,
}

#[derive(Debug, Queryable, Identifiable, AsChangeset)]
pub struct Membership {
    pub id: i32,
    pub user_id: i32,
    pub group_id: i32,
    pub permissions: serde_json::Value,
    pub group_moderation: String,
    pub user_moderation: String,
    pub created_at: SystemTime,
    pub updated_at: SystemTime,
}
#[derive(Debug, Insertable)]
#[table_name = "memberships"]
pub struct NewMembership {
    pub user_id: i32,
    pub group_id: i32,
    pub permissions: serde_json::Value,
    pub group_moderation: String,
    pub user_moderation: String,
}
