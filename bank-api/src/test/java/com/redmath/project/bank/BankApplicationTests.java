package com.redmath.project.bank;

import com.redmath.project.bank.Account.AccountRepository;
import org.hamcrest.Matchers;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.junit.jupiter.api.Order;
import org.springframework.http.MediaType;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultHandlers;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.mockito.Mockito.verify;

@SpringBootTest
@AutoConfigureMockMvc
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class BankApplicationTests {

	@Autowired
	private MockMvc mockMvc;

	@Autowired
	private AccountRepository accountRepository;

//	String expectedContentPattern = "<!DOCTYPE html>";

//	@Test
//	@WithMockUser(username = "reporter") //, roles = {"ROLE_USER"}) // Set up a mock user
//	public void testSession1ApplicationTests() throws Exception {
//		mockMvc.perform(MockMvcRequestBuilders.get("/index.html"))
//				.andDo(MockMvcResultHandlers.print())
//				.andExpect(MockMvcResultMatchers.status().is2xxSuccessful())
//				.andExpect(MockMvcResultMatchers.content().string(
//						Matchers.startsWith(expectedContentPattern)));
//	}


	@Test   //already allowed
	@Order(1)
	@WithMockUser(username = "ADMIN") //, roles = {"ROLE_USER"}) // Set up a mock user
	public void testAllAccounts() throws Exception {
		mockMvc.perform(MockMvcRequestBuilders.get("/api/v1/bankAccount/all"))
				.andDo(MockMvcResultHandlers.print())
				.andExpect(status().is2xxSuccessful())
				.andExpect(MockMvcResultMatchers.jsonPath("$[0].name").value("admin"))
				.andExpect(MockMvcResultMatchers.jsonPath("$[1].name").value("hassan"));
	}

	@Test
	@Order(2)
	@WithMockUser(username = "ADMIN") //, roles = {"ROLE_USER"}) // Set up a mock user
	public void testOneAccount() throws Exception{
		mockMvc.perform(MockMvcRequestBuilders.get("/api/v1/bankAccount/1"))
				.andDo(MockMvcResultHandlers.print())
				.andExpect(status().is2xxSuccessful())
				.andExpect(MockMvcResultMatchers.jsonPath("$.name").value("admin"));
	}

	@Test
	@Order(3)
	@WithMockUser(username = "ADMIN") //, roles = {"ROLE_USER"}) // Set up a mock user
	public void testOneAccountWithTitle() throws Exception{
		mockMvc.perform(MockMvcRequestBuilders.get("/api/v1/bankAccount?title=admin"))
				.andDo(MockMvcResultHandlers.print())
				.andExpect(status().is2xxSuccessful())
				.andExpect(MockMvcResultMatchers.jsonPath("$.content[0].name").value("admin"));
	}
	@Test
	@Order(4)
//	@WithMockUser(username = "reporter" , roles = "REPORTER") // Set up a mock user
	public void testInsertAccount() throws Exception {
		// Create a sample news object for the request body
		String jsonRequest = "{ \"name\": \"bhai\", \"password\": \"{noop}bhai\", \"roles\": \"ADMIN\", \"email\": \"bhai@gmail.com\", \"address\": \"House number E 385 Walton Road Lahore Cantt\" }";

		mockMvc.perform(MockMvcRequestBuilders.post("/api/v1/bankAccount")
						.with(SecurityMockMvcRequestPostProcessors.user("admin").authorities(new SimpleGrantedAuthority("ADMIN")))   //we can use this line as well.
						.with(SecurityMockMvcRequestPostProcessors.csrf())
						.contentType(MediaType.APPLICATION_JSON)
						.content(jsonRequest))
				.andDo(MockMvcResultHandlers.print())
				.andExpect(status().is2xxSuccessful())
				.andExpect(MockMvcResultMatchers.jsonPath("$.content.name").value("bhai"))
				.andExpect(MockMvcResultMatchers.jsonPath("$.content.roles").value("ADMIN"));
	}

//	@Test
////	@WithMockUser(username = "reporter") //, roles = {"ROLE_USER"}) // Set up a mock user
//	public void testUpdateAccount() throws Exception {
//		// Create a sample news object for the request body with updated values
//		String jsonRequest = "{ \"name\": \"bhai\", \"password\": \"{noop}bhai\", \"roles\": \"ADMIN\", \"email\": \"bhai@gmail.com\", \"address\": \"House number E 385 Walton Road Lahore Cantt\" }";
//
//		mockMvc.perform(MockMvcRequestBuilders.put("/api/v1/bankAccount/{id}", 1L)  // Provide the ID of the news item to update
//						.with(SecurityMockMvcRequestPostProcessors.user("admin").authorities(new SimpleGrantedAuthority("ADMIN")))   //we can use this line as well.
//						.with(SecurityMockMvcRequestPostProcessors.csrf())
//						.contentType(MediaType.APPLICATION_JSON)
//						.content(jsonRequest))
//				.andDo(MockMvcResultHandlers.print())
//				.andExpect(MockMvcResultMatchers.status().is2xxSuccessful())
//				.andExpect(MockMvcResultMatchers.jsonPath("$.content.name").value("bhai"))
//				.andExpect(MockMvcResultMatchers.jsonPath("$.content.roles").value("ADMIN"));
//	}
//
	@Test
	@Order(5)
//	@WithMockUser(username = "reporter", roles = {"REPORTER"}) // Set up a mock user
	public void testDeleteAccount() throws Exception {
		// Perform a DELETE request to the /api/v1/news/{id} endpoint, where {id} is the ID of the news item to delete

		// When: Perform a DELETE request to the /api/v1/news/{id} endpoint
		mockMvc.perform(delete("/api/v1/bankAccount/{id}", 1L)
						.with(SecurityMockMvcRequestPostProcessors.user("admin").authorities(new SimpleGrantedAuthority("ADMIN")))
						.with(SecurityMockMvcRequestPostProcessors.csrf()))
				.andDo(MockMvcResultHandlers.print())
				.andExpect(status().is2xxSuccessful());

//		mockMvc.perform(MockMvcRequestBuilders.delete("/api/v1/bankAccount/{id}", 1L))  // Provide the ID of the BANK Account item to delete
//				.with(SecurityMockMvcRequestPostProcessors.user("admin").authorities(new SimpleGrantedAuthority("ADMIN")))   //we can use this line as well.
//				.with(SecurityMockMvcRequestPostProcessors.csrf())
//				.andDo(MockMvcResultHandlers.print())
//				.andExpect(MockMvcResultMatchers.status().is2xxSuccessful());

		// Check (assure) that the news item is deleted from the database
		assertFalse(accountRepository.existsById(1L));
	}

	@Test   //already allowed
	@Order(6)
	@WithMockUser(username = "ADMIN") //, roles = {"ROLE_USER"}) // Set up a mock user
	public void testAllBalance() throws Exception {
		mockMvc.perform(MockMvcRequestBuilders.get("/api/v1/bankBalance"))
				.andDo(MockMvcResultHandlers.print())
				.andExpect(status().is2xxSuccessful())
				.andExpect(MockMvcResultMatchers.jsonPath("$[0].amount").value(73000))
				.andExpect(MockMvcResultMatchers.jsonPath("$[1].amount").value(85000));
	}

	@Test   //already allowed
	@Order(7)
	@WithMockUser(username = "ADMIN") //, roles = {"ROLE_USER"}) // Set up a mock user
	public void testOneBalance() throws Exception {
		mockMvc.perform(MockMvcRequestBuilders.get("/api/v1/bankBalance/1"))
				.andDo(MockMvcResultHandlers.print())
				.andExpect(status().is2xxSuccessful())
				.andExpect(MockMvcResultMatchers.jsonPath("$.amount").value(73000));
	}


	@Test   //already allowed
	@Order(8)
	@WithMockUser(username = "ADMIN") //, roles = {"ROLE_USER"}) // Set up a mock user
	public void testAllTransactions() throws Exception {
		mockMvc.perform(MockMvcRequestBuilders.get("/api/v1/bankTransaction"))
				.andDo(MockMvcResultHandlers.print())
				.andExpect(status().is2xxSuccessful())
				.andExpect(MockMvcResultMatchers.jsonPath("$.content[0].amount").value(3000))
				.andExpect(MockMvcResultMatchers.jsonPath("$.content[1].amount").value(3000));
	}

	@Test   //already allowed
	@Order(9)
	@WithMockUser(username = "ADMIN") //, roles = {"ROLE_USER"}) // Set up a mock user
	public void testOneTransaction() throws Exception {
		mockMvc.perform(MockMvcRequestBuilders.get("/api/v1/bankTransaction/1"))
				.andDo(MockMvcResultHandlers.print())
				.andExpect(status().is2xxSuccessful())
				.andExpect(MockMvcResultMatchers.jsonPath("$.amount").value(3000));
	}

	@Test
	@Order(10)
//	@WithMockUser(username = "reporter" , roles = "REPORTER") // Set up a mock user
	public void testInsertTransaction() throws Exception {
		// Create a sample news object for the request body
		String jsonRequest = "{\"amount\":1000,\"description\":\"sending to friend\",\"transactionType\":\"debit\",\"date\":\"2000-01-01T12:00:00\",\"userId\":1}";

		mockMvc.perform(MockMvcRequestBuilders.post("/api/v1/bankTransaction")
						.with(SecurityMockMvcRequestPostProcessors.user("admin").authorities(new SimpleGrantedAuthority("ADMIN")))   //we can use this line as well.
						.with(SecurityMockMvcRequestPostProcessors.csrf())
						.contentType(MediaType.APPLICATION_JSON)
						.content(jsonRequest))
				.andDo(MockMvcResultHandlers.print())
				.andExpect(status().is2xxSuccessful())
				.andExpect(MockMvcResultMatchers.jsonPath("$.content.amount").value(1000))
				.andExpect(MockMvcResultMatchers.jsonPath("$.content.description").value("sending to friend"));
	}

}
