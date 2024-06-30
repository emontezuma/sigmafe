import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogWorkgroupsListComponent } from './catalog-workgroups-list.component';

describe('CatalogWorkgroupsComponent', () => {
  let component: CatalogWorkgroupsListComponent;
  let fixture: ComponentFixture<CatalogWorkgroupsListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CatalogWorkgroupsListComponent]
    });
    fixture = TestBed.createComponent(CatalogWorkgroupsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
