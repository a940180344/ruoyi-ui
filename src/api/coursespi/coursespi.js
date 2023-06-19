import request from '@/utils/request'

// 查询coursespi列表
export function listCoursespi(query) {
  return request({
    url: '/coursespi/coursespi/list',
    method: 'get',
    params: query
  })
}

// 查询coursespi详细
export function getCoursespi(id) {
  return request({
    url: '/coursespi/coursespi/' + id,
    method: 'get'
  })
}

// 新增coursespi
export function addCoursespi(data) {
  return request({
    url: '/coursespi/coursespi',
    method: 'post',
    data: data
  })
}

// 修改coursespi
export function updateCoursespi(data) {
  return request({
    url: '/coursespi/coursespi',
    method: 'put',
    data: data
  })
}

// 删除coursespi
export function delCoursespi(id) {
  return request({
    url: '/coursespi/coursespi/' + id,
    method: 'delete'
  })
}
