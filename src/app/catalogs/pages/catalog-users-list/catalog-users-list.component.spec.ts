import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogUsersListComponent } from './catalog-users-list.component';

describe('CatalogWorkgroupsComponent', () => {
  let component: CatalogUsersListComponent;
  let fixture: ComponentFixture<CatalogUsersListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CatalogUsersListComponent]
    });
    fixture = TestBed.createComponent(CatalogUsersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
